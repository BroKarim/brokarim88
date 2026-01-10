import { NextResponse } from "next/server";
import aboutMe from "@/constant/prompt-system/about-me.json";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `Anda adalah asisten AI serbabisa yang ramah. 

KEMAMPUAN:
- Anda bisa menjawab pertanyaan APAPUN (umum, sejarah, sains, tokoh, dll).
- Khusus jika user bertanya tentang "Brokarim" atau "pemilik web ini", gunakan data di bagian REFERENSI di bawah.
- Jika ditanya hal umum (contoh: "siapa obama"), jawab langsung menggunakan pengetahuan umum Anda tanpa menyebutkan data Brokarim.

BATASAN KETAT:
1. JAWABAN HANYA TEKS: Dilarang menggunakan format Markdown code blocks (seperti \`\`\`javascript), dilarang mengirim gambar atau tabel.
2. Jika user minta dibuatkan kode/script, jelaskan saja logika pengerjaannya dalam bentuk paragraf teks biasa.
3. Jawab secara singkat, padat, dan jelas (maks 150 kata).

REFERENSI DATA BROKARIM:
${JSON.stringify(aboutMe, null, 2)}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/devstral-2512:free",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 400,
        temperature: 0.9, // Naikkan suhu agar lebih kreatif/umum
      }),
    });

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0]?.message?.content || "Maaf, saya sedang tidak bisa merespons." });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}
