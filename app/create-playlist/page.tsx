'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Share2, Copy, Check, ArrowLeft } from 'lucide-react'

export default function CreatePlaylist() {
  const [streams, setStreams] = useState<Array<{ title: string; url: string }>>([
    { title: '', url: '' },
  ])
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const addStream = () => {
    setStreams([...streams, { title: '', url: '' }])
  }

  const removeStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index))
  }

  const updateStream = (index: number, field: string, value: string) => {
    const updated = [...streams]
    updated[index] = { ...updated[index], [field]: value }
    setStreams(updated)
  }

  const generatePlaylist = async () => {
    // Фильтруем пустые потоки
    const validStreams = streams.filter(s => s.url.trim())
    if (validStreams.length === 0) {
      alert('Добавьте хотя бы один поток')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streams: validStreams }),
      })

      const data = await response.json()
      if (data.playlistId) {
        const shareUrl = `/player?url=${encodeURIComponent(`/api/playlists/${data.playlistId}`)}`
        setPlaylistUrl(`${window.location.origin}${shareUrl}`)
      } else {
        alert('Ошибка: ' + (data.error || 'неизвестная ошибка'))
      }
    } catch (error) {
      console.error('[v0] Error creating playlist:', error)
      alert('Ошибка создания плейлиста')
    } finally {
      setLoading(false)
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(playlistUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = playlistUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
            </Link>
            <h1 className="font-display text-2xl font-bold">Создать плейлист</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-6 text-sm text-muted-foreground">
            Добавьте потоки в плейлист. Укажите название канала и ссылку на поток (M3U8, MP4, PHP скрипт и т.д.)
          </p>

          <div className="space-y-4">
            {streams.map((stream, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-end sm:gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Название канала
                  </label>
                  <input
                    type="text"
                    value={stream.title}
                    onChange={(e) => updateStream(index, 'title', e.target.value)}
                    placeholder="Например: НТВ, Россия-1"
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div className="flex-[2]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Ссылка на поток
                  </label>
                  <input
                    type="text"
                    value={stream.url}
                    onChange={(e) => updateStream(index, 'url', e.target.value)}
                    placeholder="https://example.com/stream.m3u8"
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeStream(index)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={addStream}
            className="mt-4 gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Добавить поток
          </Button>

          <Button
            onClick={generatePlaylist}
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading ? 'Создание...' : 'Создать плейлист'}
          </Button>
        </div>

        {playlistUrl && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-bold">Ваш плейлист готов!</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Поделитесь этой ссылкой со своими друзьями:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={playlistUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground"
              />
              <Button
                variant="default"
                size="sm"
                onClick={copyUrl}
                className="gap-1.5 shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Скопировано' : 'Копировать'}
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link href={playlistUrl} target="_blank" className="flex-1">
                <Button className="w-full">Открыть плейлист</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setPlaylistUrl('')
                  setStreams([{ title: '', url: '' }])
                }}
                className="flex-1"
              >
                Создать новый
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
