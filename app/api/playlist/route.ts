import { NextRequest, NextResponse } from 'next/server'
import { playlistsStore } from '@/lib/playlists-store'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  const decodedUrl = decodeURIComponent(url)
  console.log('[v0] Playlist API processing:', decodedUrl)

  try {
    // Если это локальный плейлист из /api/playlists/[id]
    if (decodedUrl.startsWith('/api/playlists/')) {
      const playlistId = decodedUrl.split('/').pop()
      if (playlistId) {
        const playlist = playlistsStore.get(playlistId)
        if (playlist) {
          console.log('[v0] Found local playlist:', playlistId)
          return NextResponse.json({ playlist })
        }
      }
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    // Загружаем внешний плейлист с User-Agent для совместимости
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      console.error('[v0] Playlist fetch error:', response.status)
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status }
      )
    }

    const content = await response.text()
    const playlist = parseM3U(content)

    return NextResponse.json({ playlist })
  } catch (error: any) {
    console.error('[v0] Playlist error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load playlist' },
      { status: 500 }
    )
  }
}

function parseM3U(
  content: string
): Array<{ title: string; file: string; image?: string }> {
  const lines = content.split('\n')
  const playlist: Array<{ title: string; file: string; image?: string }> = []
  let currentTitle = ''
  let currentImage = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith('#EXTINF:')) {
      // Извлекаем название канала и логотип
      const logoMatch = line.match(/tvg-logo="([^"]+)"/)
      currentImage = logoMatch ? logoMatch[1] : ''
      
      currentTitle =
        line.split(',').pop()?.trim() || `Канал ${playlist.length + 1}`
    } else if (line && !line.startsWith('#')) {
      // Это URL потока - проксируем если нужно
      if (currentTitle) {
        let fileUrl = line
        // Проксируем потоки через наш API для обхода блокировок
        if (line.startsWith('http')) {
          fileUrl = `/api/proxy?url=${encodeURIComponent(line)}`
        }
        
        const item: any = {
          title: currentTitle,
          file: fileUrl,
        }
        
        if (currentImage) {
          item.image = currentImage
        }
        
        playlist.push(item)
        currentTitle = ''
        currentImage = ''
      }
    }
  }

  return playlist
}
