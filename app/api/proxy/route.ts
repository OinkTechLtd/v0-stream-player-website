import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
    }

    // Декодируем URL если нужно
    const decodedUrl = decodeURIComponent(url)
    
    console.log('[v0] Proxying request to:', decodedUrl)

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': new URL(decodedUrl).origin + '/',
        'Accept': '*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      console.error('[v0] Stream response error:', response.status)
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: response.status })
    }

    // Возвращаем поток как есть
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[v0] Proxy error:', error)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
