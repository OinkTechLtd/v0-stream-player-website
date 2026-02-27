import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    // Загружаем плейлист с User-Agent для совместимости
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Timeout 10 секунд
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status }
      )
    }

    const content = await response.text()
    const playlist = parseM3U(content)

    return NextResponse.json({ playlist })
  } catch (error: any) {
    console.error('[v0] Playlist fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load playlist' },
      { status: 500 }
    )
  }
}

function parseM3U(
  content: string
): Array<{ title: string; file: string }> {
  const lines = content.split('\n')
  const playlist: Array<{ title: string; file: string }> = []
  let currentTitle = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith('#EXTINF:')) {
      // Извлекаем название канала (после запятой)
      currentTitle =
        line.split(',').pop()?.trim() || `Канал ${playlist.length + 1}`
    } else if (line && !line.startsWith('#')) {
      // Это URL потока
      if (currentTitle) {
        playlist.push({
          title: currentTitle,
          file: line,
        })
        currentTitle = ''
      }
    }
  }

  return playlist
}
