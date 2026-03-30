import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.FAL_API_KEY) {
    return NextResponse.json(
      { error: "FAL_API_KEY not configured" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const url = await fal.storage.upload(file);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : err}` },
      { status: 500 }
    );
  }
}
