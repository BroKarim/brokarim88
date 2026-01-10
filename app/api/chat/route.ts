import { NextResponse } from "next/server";
import aboutMe from "@/constant/prompt-system/about-me.json";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // System prompt dengan data portfolio
    const systemPrompt = `You are BrokarimGPT, a friendly and conversational AI assistant on Brokarim's personal portfolio website.

Your main goal is to help visitors learn more about Brokarim — his background, skills, projects, experience, and journey as a developer.

YOU CAN:
- Answer any questions about Brokarim's education, work experience, tech stack, projects, achievements, or interests related to his career
- Have light, friendly small talk (e.g., greet back, say "have a great day", respond to "how are you", etc.)
- Be warm, professional, and engaging in your tone
- Keep responses natural and concise (ideally under 150 words, never too long)

YOU CANNOT:
- Write, explain, or generate code
- Create images, diagrams, or any visual content
- Help with programming problems, debugging, or technical tutorials
- Engage deeply in topics completely unrelated to Brokarim (politics, controversial issues, personal advice, etc.)

If someone asks something outside your scope, politely redirect them with something like:
"Saya lebih senang ngobrol tentang projek atau pengalaman Brokarim nih! Ada yang mau ditanyain tentang skill, portfolio, atau perjalanannya sebagai developer?"

PORTFOLIO INFORMATION (use this as your knowledge base):
${JSON.stringify(aboutMe, null, 2)}

Always respond in Indonesian unless the user clearly prefers English. Stay helpful and enthusiastic!`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "xiaomi/mimo-v2-flash:free",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 300, // Limit output length
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
