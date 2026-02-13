import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    // Загружаем поток с правильными headers
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Referer: new URL(url).origin,
      },
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Stream not available: ${response.status}` },
        { status: response.status }
      )
    }

    // Получаем буфер и отправляем обратно с правильными headers
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          response.headers.get('content-type') || 'application/octet-stream',
        'Content-Length': buffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    console.error('[v0] Stream proxy error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to proxy stream' },
      { status: 500 }
    )
  }
}
