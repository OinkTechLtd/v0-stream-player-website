import { NextRequest, NextResponse } from 'next/server'

// Хранилище метаданных плейлистов с длительностью видео
const playlistMetadata = new Map<string, any>()

export async function GET(request: NextRequest) {
  const playlistUrl = request.nextUrl.searchParams.get('playlist')
  
  if (!playlistUrl) {
    return NextResponse.json({ error: 'Playlist URL required' }, { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(playlistUrl)
    
    // Загружаем плейлист с метаданными (длительность видео)
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to load playlist' }, { status: 400 })
    }

    const content = await response.text()
    const lines = content.split('\n')
    const playlist: any[] = []
    let totalDuration = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('#EXTINF:')) {
        // Извлекаем длительность из #EXTINF (первое число)
        const durationMatch = line.match(/#EXTINF:(-?\d+)/)
        let duration = durationMatch ? Math.abs(parseInt(durationMatch[1])) : 0

        const logoMatch = line.match(/tvg-logo="([^"]+)"/)
        const logo = logoMatch ? logoMatch[1] : ''
        const title = line.split(',').pop()?.trim() || 'Видео'

        const nextLine = lines[i + 1]?.trim()
        if (nextLine && !nextLine.startsWith('#')) {
          // Если длительность 0 или не указана, используем дефолт (5 минут для MP4, 3 часа для потоков)
          if (duration === 0) {
            if (nextLine.includes('.m3u8') || nextLine.includes('.ts') || nextLine.includes('http')) {
              duration = 10800 // 3 часа для потоков
            } else {
              duration = 300 // 5 минут для видеофайлов (будет вычислена при загрузке)
            }
          }

          playlist.push({
            title,
            file: nextLine,
            duration,
            logo,
            startTime: totalDuration,
            endTime: totalDuration + duration,
          })
          totalDuration += duration
          i++
        }
      }
    }

    if (playlist.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 400 })
    }

    // Сейчас вычисляем какой видеофайл должен играть
    const now = Date.now() / 1000 // текущее время в секундах
    const startTimestamp = Math.floor(now / totalDuration) * totalDuration // начало текущего цикла
    const elapsedInCycle = now - startTimestamp // сколько секунд в текущем цикле

    let currentVideo = null
    let currentProgress = 0 // прогресс текущего видео в процентах
    let timeInCurrentVideo = 0 // время в текущем видео

    for (const video of playlist) {
      if (elapsedInCycle >= video.startTime && elapsedInCycle < video.endTime) {
        currentVideo = video
        timeInCurrentVideo = elapsedInCycle - video.startTime
        if (video.duration > 0) {
          currentProgress = (timeInCurrentVideo / video.duration) * 100
        }
        break
      }
    }

    if (!currentVideo) {
      currentVideo = playlist[0]
      timeInCurrentVideo = 0
      currentProgress = 0
    }

    return NextResponse.json({
      playlist,
      current: {
        index: playlist.indexOf(currentVideo),
        file: currentVideo.file,
        title: currentVideo.title,
        logo: currentVideo.logo,
        duration: currentVideo.duration,
        progress: currentProgress,
        timeInSeconds: timeInCurrentVideo,
      },
      broadcast: {
        startTime: startTimestamp,
        cycleStartTime: new Date(startTimestamp * 1000).toISOString(),
        totalDuration,
        elapsedInCycle: Math.floor(elapsedInCycle),
      },
      viewers: Math.floor(Math.random() * 1000) + 1, // Имитация зрителей
    })
  } catch (error: any) {
    console.error('[v0] Broadcast sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
