import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import path from "path";
import type { ModelId } from "@/lib/models";

fal.config({ credentials: process.env.FAL_API_KEY });

let cachedStyleUrl: string | null = null;
let cachedStyleBuffer: Buffer | null = null;

async function getStyleBuffer(): Promise<Buffer> {
  if (cachedStyleBuffer) return cachedStyleBuffer;
  const filePath = path.join(process.cwd(), "public", "character.png");
  cachedStyleBuffer = await readFile(filePath);
  return cachedStyleBuffer;
}

async function getStyleReferenceUrl(): Promise<string> {
  if (cachedStyleUrl) return cachedStyleUrl;
  const buffer = await getStyleBuffer();
  const file = new File([new Uint8Array(buffer)], "character.png", { type: "image/png" });
  cachedStyleUrl = await fal.storage.upload(file);
  return cachedStyleUrl;
}

async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  return Buffer.from(await res.arrayBuffer());
}

// --- Gemini Flash ---
async function generateWithGemini(
  faceImageUrl: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");

  const ai = new GoogleGenAI({ apiKey });

  const faceBuffer = await fetchImageAsBuffer(faceImageUrl);
  const styleBuffer = await getStyleBuffer();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      { inlineData: { data: faceBuffer.toString("base64"), mimeType: "image/jpeg" } },
      { inlineData: { data: styleBuffer.toString("base64"), mimeType: "image/png" } },
      {
        text: `Using the person's face from the first image and the art style from the second image, generate: ${prompt}. Output a single square image.`,
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData) {
      const mime = part.inlineData.mimeType || "image/png";
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image returned from Gemini");
}

// --- Nano Banana 2 (fal.ai) ---
async function generateWithNanoBanana(
  faceImageUrl: string,
  prompt: string
): Promise<string> {
  if (!process.env.FAL_API_KEY) throw new Error("FAL_API_KEY not configured");

  const styleUrl = await getStyleReferenceUrl();

  const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
    input: {
      image_urls: [faceImageUrl, styleUrl],
      prompt,
      num_images: 1,
      aspect_ratio: "1:1",
      output_format: "jpeg",
      resolution: "0.5K",
    },
  });

  const data = result.data as Record<string, unknown>;
  const images = data.images as Array<{ url: string }> | undefined;
  const imageUrl = images?.[0]?.url;

  if (!imageUrl) throw new Error("No image returned from Nano Banana");
  return imageUrl;
}

// --- Kling O1 (fal.ai) ---
async function generateWithKling(
  faceImageUrl: string,
  prompt: string
): Promise<string> {
  if (!process.env.FAL_API_KEY) throw new Error("FAL_API_KEY not configured");

  const styleUrl = await getStyleReferenceUrl();

  const result = await fal.subscribe("fal-ai/kling-image/o1", {
    input: {
      image_urls: [faceImageUrl, styleUrl],
      prompt: `Using the face from @Image1 and the style from @Image2: ${prompt}`,
      num_images: 1,
      aspect_ratio: "1:1",
      output_format: "jpeg",
    },
  });

  const data = result.data as Record<string, unknown>;
  const images = data.images as Array<{ url: string }> | undefined;
  const imageUrl = images?.[0]?.url;

  if (!imageUrl) throw new Error("No image returned from Kling O1");
  return imageUrl;
}

const generators: Record<ModelId, (faceUrl: string, prompt: string) => Promise<string>> = {
  "gemini-flash": generateWithGemini,
  "nano-banana": generateWithNanoBanana,
  "kling-o1": generateWithKling,
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { faceImageUrl, prompt, model = "gemini-flash" } = body as {
    faceImageUrl?: string;
    prompt?: string;
    model?: ModelId;
  };

  if (!faceImageUrl) {
    return NextResponse.json(
      { error: "faceImageUrl is required" },
      { status: 400 }
    );
  }

  const defaultPrompt =
    "3D cartoon avatar in Maxxed casino brand style, colorful hair, X eyes, bold expressive face, glossy 3D render, black background, high quality";

  const generate = generators[model];
  if (!generate) {
    return NextResponse.json(
      { error: `Unknown model: ${model}` },
      { status: 400 }
    );
  }

  try {
    const imageUrl = await generate(faceImageUrl, prompt || defaultPrompt);
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
