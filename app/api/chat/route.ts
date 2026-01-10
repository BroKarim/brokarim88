import { NextResponse } from "next/server";
import aboutMe from "@/constant/prompt-system/about-me.json";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // System prompt dengan data portfolio
    const systemPrompt = `You are a helpful AI assistant representing a portfolio website. You can only answer questions about the portfolio owner and their professional information.

IMPORTANT RULES:
- Only answer questions about the person's background, skills, projects, and experience
- DO NOT write code, create applications, or provide technical tutorials
- DO NOT help with tasks unrelated to the portfolio information
- Keep responses concise and professional (max 150 words)
- If asked to do something outside your scope, politely redirect to asking about the portfolio

PORTFOLIO INFORMATION:
${JSON.stringify(aboutMe, null, 2)}

Answer questions naturally and conversationally based on this information.`;

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
