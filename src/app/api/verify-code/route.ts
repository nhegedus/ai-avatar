import { NextRequest, NextResponse } from "next/server";

const VALID_CODE = "6767";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (code === VALID_CODE) {
    return NextResponse.json({ authorized: true });
  }

  return NextResponse.json({ error: "Invalid code" }, { status: 401 });
}
