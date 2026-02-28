import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(url)
    console.log('[v0] Loading playlist:', decodedUrl.substring(0, 80))

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: response.status })
    }

    const content = await response.text()
    const lines = content.split('\n')
    const playlist: any[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('#EXTINF:')) {
        const logoMatch = line.match(/tvg-logo="([^"]+)"/)
        const logo = logoMatch ? logoMatch[1] : ''
        const title = line.split(',').pop()?.trim() || 'Канал'

        const nextLine = lines[i + 1]?.trim()
        if (nextLine && !nextLine.startsWith('#')) {
          const streamUrl = nextLine
          let fileUrl = streamUrl

          // Проксируем потоки которые требуют CORS обхода
          if (streamUrl.includes('.php') || /^\d+\.\d+\.\d+\.\d+/.test(streamUrl)) {
            fileUrl = `/api/stream-proxy?url=${encodeURIComponent(streamUrl)}`
          }

          playlist.push({
            title,
            file: fileUrl,
            image: logo,
            poster: logo,
          })
          i++
        }
      }
    }

    return NextResponse.json({ playlist, count: playlist.length })
  } catch (error: any) {
    console.error('[v0] Playlist error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
