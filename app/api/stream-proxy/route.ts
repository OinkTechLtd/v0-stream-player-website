import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(url)
    console.log('[v0] Proxying stream:', decodedUrl.substring(0, 80))

    const urlObj = new URL(decodedUrl)
    const referer = urlObj.origin + '/'

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': '*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      console.error('[v0] Stream error:', response.status)
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Для M3U8 плейлистов - обработай относительные пути
    if (contentType.includes('application/vnd.apple.mpegurl') || decodedUrl.endsWith('.m3u8')) {
      let content = await response.text()
      const baseUrl = urlObj.origin
      const basePath = urlObj.pathname.split('/').slice(0, -1).join('/')

      content = content.split('\n').map((line) => {
        if (line && !line.startsWith('#') && !line.startsWith('http')) {
          const fullUrl = baseUrl + basePath + '/' + line
          return `/api/stream-proxy?url=${encodeURIComponent(fullUrl)}`
        }
        return line
      }).join('\n')

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error: any) {
    console.error('[v0] Proxy error:', error)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
