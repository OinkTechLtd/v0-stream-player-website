'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Share2, Copy, Check } from 'lucide-react'
import Link from 'next/link'

interface Playlist {
  id: string
  title: string
  streams: Array<{ title: string; url: string }>
}

export default function MyPlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [streams, setStreams] = useState([{ title: '', url: '' }])
  const [copied, setCopied] = useState<string | null>(null)

  const addStream = () => {
    setStreams([...streams, { title: '', url: '' }])
  }

  const removeStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index))
  }

  const updateStream = (index: number, field: 'title' | 'url', value: string) => {
    const newStreams = [...streams]
    newStreams[index] = { ...newStreams[index], [field]: value }
    setStreams(newStreams)
  }

  const savePlaylist = () => {
    if (!title.trim()) {
      alert('Введите название плейлиста')
      return
    }
    const validStreams = streams.filter(s => s.url.trim())
    if (validStreams.length === 0) {
      alert('Добавьте хотя бы один поток')
      return
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: title.trim(),
      streams: validStreams,
    }

    setPlaylists([...playlists, newPlaylist])
    setTitle('')
    setStreams([{ title: '', url: '' }])
    setShowForm(false)
  }

  const deletePlaylist = (id: string) => {
    if (confirm('Удалить плейлист?')) {
      setPlaylists(playlists.filter(p => p.id !== id))
    }
  }

  const generateM3U = (playlist: Playlist) => {
    let m3u = '#EXTM3U\n'
    for (const stream of playlist.streams) {
      m3u += `#EXTINF:-1,${stream.title || 'Канал'}\n${stream.url}\n`
    }
    return m3u
  }

  const sharePlaylist = (playlist: Playlist) => {
    const m3u = generateM3U(playlist)
    const shareUrl = `${window.location.origin}/player?url=${encodeURIComponent('data:text/plain;charset=utf-8,' + m3u)}`
    
    navigator.clipboard.writeText(shareUrl)
    setCopied(playlist.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="flex-1 text-2xl font-bold">Мои плейлисты</h1>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Новый
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {showForm && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Создать плейлист</h2>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Название</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Мой плейлист"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              />
            </div>

            <label className="mb-3 block text-sm font-medium">Потоки</label>
            <div className="space-y-3 mb-4">
              {streams.map((stream, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={stream.title}
                    onChange={(e) => updateStream(idx, 'title', e.target.value)}
                    placeholder="Название канала"
                    className="w-24 rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={stream.url}
                    onChange={(e) => updateStream(idx, 'url', e.target.value)}
                    placeholder="https://example.com/stream.m3u8"
                    className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStream(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addStream} className="mb-4 gap-2 w-full">
              <Plus className="h-4 w-4" />
              Добавить поток
            </Button>

            <div className="flex gap-2">
              <Button onClick={savePlaylist} className="flex-1">
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Отмена
              </Button>
            </div>
          </div>
        )}

        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">У вас нет плейлистов</p>
            <Button onClick={() => setShowForm(true)}>Создать первый плейлист</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{playlist.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sharePlaylist(playlist)}
                      className="gap-2"
                    >
                      {copied === playlist.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Скопировать
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{playlist.streams.length} потоков</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
