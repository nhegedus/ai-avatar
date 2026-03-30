import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { readFile } from "fs/promises";
import path from "path";

fal.config({ credentials: process.env.FAL_API_KEY });

let cachedStyleUrl: string | null = null;

async function getStyleReferenceUrl(): Promise<string> {
  if (cachedStyleUrl) return cachedStyleUrl;
  const filePath = path.join(process.cwd(), "public", "character.png");
  const buffer = await readFile(filePath);
  const file = new File([buffer], "character.png", { type: "image/png" });
  cachedStyleUrl = await fal.storage.upload(file);
  return cachedStyleUrl;
}

export async function POST(req: NextRequest) {
  if (!process.env.FAL_API_KEY) {
    return NextResponse.json(
      { error: "FAL_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { faceImageUrl, prompt } = body;

  if (!faceImageUrl) {
    return NextResponse.json(
      { error: "faceImageUrl is required" },
      { status: 400 }
    );
  }

  try {
    const styleUrl = await getStyleReferenceUrl();

    const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
      input: {
        image_urls: [faceImageUrl, styleUrl],
        prompt:
          prompt ||
          "3D cartoon avatar in Maxxed casino brand style, colorful hair, X eyes, bold expressive face, glossy 3D render, black background, high quality",
        num_images: 1,
        aspect_ratio: "1:1",
        output_format: "png",
        resolution: "1K",
      },
    });

    const data = result.data as Record<string, unknown>;
    const images = data.images as Array<{ url: string }> | undefined;
    const imageUrl = images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image returned from API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Generation failed: ${err instanceof Error ? err.message : err}`,
      },
      { status: 500 }
    );
  }
}
