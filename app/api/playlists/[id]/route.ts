import { NextRequest, NextResponse } from 'next/server'
import { playlistsStore } from '@/lib/playlists-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const playlist = playlistsStore.get(id)

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    // Генерируем M3U контент
    let m3u = '#EXTM3U\n'
    for (const stream of playlist) {
      m3u += `#EXTINF:-1,${stream.title}\n`
      m3u += `${stream.file}\n`
    }

    return new NextResponse(m3u, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
        'Content-Disposition': 'inline; filename="playlist.m3u"',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching playlist:', error)
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 })
  }
}
