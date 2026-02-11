import { NextRequest, NextResponse } from "next/server"

function encodeId(url: string): string {
  return Buffer.from(url)
    .toString("base64url")
    .replace(/=+$/, "")
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const id = encodeId(url)
    const origin = request.nextUrl.origin
    const shareUrl = `${origin}/w/${id}`

    return NextResponse.json({ shareUrl, id })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
