import { NextRequest, NextResponse } from "next/server";
import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const pageId = formData.get("pageId") as string;

    if (!audioFile || !pageId) {
      return NextResponse.json(
        { error: "Audio file and pageId are required" },
        { status: 400 }
      );
    }

    // Read the audio file
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Determine content type
    const contentType = audioFile.type || "audio/mpeg";
    const ext = audioFile.name.split(".").pop() || "mp3";

    // Upload to Supabase Storage
    const fileName = `${pageId}/our-song-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, audioBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      audioUrl: publicUrl,
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload audio" },
      { status: 500 }
    );
  }
}
