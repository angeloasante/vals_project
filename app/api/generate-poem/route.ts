import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a prompt" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a romantic poet. Generate beautiful, heartfelt love poems based on the user's input.
    
Style preferences:
- "romantic": Classic, deeply romantic with elegant imagery
- "funny": Light-hearted, playful, with gentle humor and wit
- "passionate": Intense, emotional, burning with desire
- "sweet": Cute, adorable, innocent and tender
- "poetic": Literary, metaphor-rich, artistically crafted

Guidelines:
- Write 6-10 lines of poetry
- Each line should be on a new line
- Include 1-2 empty lines as stanza breaks
- Add one emoji at the end that fits the mood
- Make it personal and touching
- Do NOT use generic clichés
- Only return the poem itself, no title, no quotes, no extra formatting`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Write a love poem with a ${style || "romantic"} style. The theme/vibe is: "${prompt}"` 
          },
        ],
        max_tokens: 300,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI error:", error);
      return NextResponse.json(
        { error: "Failed to generate poem" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const poem = data.choices[0]?.message?.content?.trim();

    if (!poem) {
      return NextResponse.json(
        { error: "No poem generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ poem });
  } catch (error) {
    console.error("Generate poem error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
