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

    const systemPrompt = `You are a romantic poet and love letter writer. Generate heartfelt, sincere love messages based on the user's input. 
    
Style preferences:
- "romantic": Classic, poetic, deeply romantic
- "funny": Light-hearted, playful, with humor
- "comforting": Warm, supportive, reassuring
- "passionate": Intense, emotional, passionate
- "sweet": Cute, adorable, sweet and simple

Keep the message between 2-4 sentences for a love letter. Make it personal and touching.
Do NOT use generic phrases. Make each message unique and heartfelt.
Only return the message itself, no quotes or extra formatting.`;

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
            content: `Write a love letter message with a ${style || "romantic"} style. The context/vibe is: "${prompt}"` 
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI error:", error);
      return NextResponse.json(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "No message generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
