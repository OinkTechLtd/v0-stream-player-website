import { NextRequest, NextResponse } from 'next/server'

// Кэш длительностей видео в памяти
const durationCache = new Map<string, number>()

export async function GET(request: NextRequest) {
  const playlistUrl = request.nextUrl.searchParams.get('playlist')

  if (!playlistUrl) {
    return NextResponse.json({ error: 'Playlist URL required' }, { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(playlistUrl)
    console.log('[v0] Sync stream for:', decodedUrl)

    // Загружаем плейлист
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to load playlist: ${response.status}` },
        { status: 400 }
      )
    }

    const content = await response.text()
    const videos = parseM3U(content)

    if (!videos || videos.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 400 })
    }

    // Получаем реальные длительности для каждого видео
    const videosWithDuration = await Promise.all(
      videos.map(async (video) => {
        const cacheKey = video.file
        if (durationCache.has(cacheKey)) {
          video.duration = durationCache.get(cacheKey) || 300
        } else {
          // Пытаемся получить длительность из заголовков или используем дефолт
          const duration = await getVideoDuration(video.file)
          durationCache.set(cacheKey, duration)
          video.duration = duration
        }
        return video
      })
    )

    // Рассчитываем текущий видеофайл на основе серверного времени
    const now = Date.now()
    const startTime = new Date(2024, 0, 1).getTime() // Дата начала трансляции (фиксированная)
    const elapsedMs = now - startTime
    const elapsedSeconds = Math.floor(elapsedMs / 1000)

    let currentIndex = 0
    let timeInCurrentVideo = elapsedSeconds
    let totalSeconds = 0

    for (let i = 0; i < videosWithDuration.length; i++) {
      const videoDuration = videosWithDuration[i].duration || 300
      if (totalSeconds + videoDuration > elapsedSeconds) {
        currentIndex = i
        timeInCurrentVideo = elapsedSeconds - totalSeconds
        break
      }
      totalSeconds += videoDuration
    }

    // Циклируем плейлист если дошли до конца
    if (currentIndex >= videosWithDuration.length) {
      currentIndex = currentIndex % videosWithDuration.length
      timeInCurrentVideo = elapsedSeconds % totalSeconds
    }

    const currentVideo = videosWithDuration[currentIndex]

    console.log(
      '[v0] Current video:',
      currentIndex,
      currentVideo.title,
      'at',
      timeInCurrentVideo,
      '/',
      currentVideo.duration
    )

    return NextResponse.json({
      success: true,
      currentIndex,
      currentVideo: {
        index: currentIndex,
        title: currentVideo.title,
        file: currentVideo.file,
        duration: currentVideo.duration,
        timeInSeconds: timeInCurrentVideo,
        logo: currentVideo.logo,
      },
      playlist: videosWithDuration,
      totalVideos: videosWithDuration.length,
      serverTime: now,
    })
  } catch (error: any) {
    console.error('[v0] Sync stream error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync stream' },
      { status: 500 }
    )
  }
}

function parseM3U(content: string) {
  const lines = content.split('\n')
  const videos: any[] = []
  let currentTitle = ''
  let currentLogo = ''
  let currentDuration = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith('#EXTINF:')) {
      // Извлекаем длительность
      const durationMatch = line.match(/#EXTINF:(-?\d+)/)
      currentDuration = durationMatch ? Math.abs(parseInt(durationMatch[1])) : 0

      // Извлекаем логотип
      const logoMatch = line.match(/tvg-logo="([^"]+)"/)
      currentLogo = logoMatch ? logoMatch[1] : ''

      // Извлекаем название
      currentTitle = line.split(',').pop()?.trim() || 'Видео'
    } else if (line && !line.startsWith('#')) {
      // Это URL видео
      videos.push({
        title: currentTitle,
        file: line,
        duration: Math.max(currentDuration, 300), // Минимум 5 минут
        logo: currentLogo,
      })
      currentTitle = ''
      currentLogo = ''
      currentDuration = 0
    }
  }

  return videos
}

async function getVideoDuration(videoUrl: string): Promise<number> {
  try {
    // Пытаемся получить Content-Length для оценки длительности
    const headResponse = await fetch(videoUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(5000),
    })

    const contentLength = headResponse.headers.get('content-length')
    if (contentLength) {
      // Грубая оценка: примерно 1MB = 10 секунд (зависит от битрейта)
      const bytes = parseInt(contentLength)
      const estimatedSeconds = Math.floor(bytes / (1024 * 1024 * 10))
      if (estimatedSeconds > 0) {
        return Math.max(estimatedSeconds, 300) // Минимум 5 минут
      }
    }
  } catch (error) {
    console.log('[v0] Could not get video duration:', error)
  }

  // Дефолт: 10 минут для видео
  return 600
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
