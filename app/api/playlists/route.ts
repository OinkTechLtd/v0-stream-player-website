import { NextRequest, NextResponse } from 'next/server'
import { playlistsStore } from '@/lib/playlists-store'

export async function POST(request: NextRequest) {
  try {
    const { streams } = await request.json()

    if (!streams || streams.length === 0) {
      return NextResponse.json(
        { error: 'No streams provided' },
        { status: 400 }
      )
    }

    // Генерируем ID плейлиста
    const playlistId = Math.random().toString(36).substring(2, 11)

    // Преобразуем в формат плеера
    const playlist = streams.map((s: { title: string; url: string }) => ({
      title: s.title || 'Без названия',
      file: s.url,
    }))

    playlistsStore.set(playlistId, playlist)

    return NextResponse.json({ playlistId })
  } catch (error) {
    console.error('[v0] Error creating playlist:', error)
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    )
  }
}
