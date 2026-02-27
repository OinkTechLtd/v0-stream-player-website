'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Plus, Trash2, Download, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreatePlaylistPage() {
  const [streams, setStreams] = useState<Array<{ title: string; url: string }>>([
    { title: '', url: '' },
  ])
  const [m3uContent, setM3uContent] = useState('')
  const [copied, setCopied] = useState(false)

  const updateStream = (index: number, field: 'title' | 'url', value: string) => {
    const newStreams = [...streams]
    newStreams[index] = { ...newStreams[index], [field]: value }
    setStreams(newStreams)
  }

  const addStream = () => {
    setStreams([...streams, { title: '', url: '' }])
  }

  const removeStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index))
  }

  const generateM3U = () => {
    let content = '#EXTM3U\n'
    let hasValidStream = false
    for (const stream of streams) {
      if (stream.url.trim()) {
        const title = stream.title.trim() || 'Канал'
        content += `#EXTINF:-1,${title}\n${stream.url.trim()}\n`
        hasValidStream = true
      }
    }
    if (!hasValidStream) {
      alert('Добавьте хотя бы один поток')
      return
    }
    setM3uContent(content)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(m3uContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadM3U = () => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(m3uContent))
    element.setAttribute('download', 'playlist.m3u')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const uploadM3U = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const lines = content.split('\n')
        const newStreams: Array<{ title: string; url: string }> = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('#EXTINF:')) {
            const title = line.split(',').pop()?.trim() || 'Канал'
            const nextLine = lines[i + 1]?.trim()
            if (nextLine && !nextLine.startsWith('#')) {
              newStreams.push({ title, url: nextLine })
              i++
            }
          }
        }

        if (newStreams.length > 0) {
          setStreams(newStreams)
          setM3uContent(content)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Создать M3U плейлист</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          {/* Upload M3U */}
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-3 block text-sm font-semibold text-foreground">
              <Upload className="mb-2 inline h-4 w-4" /> Загрузить M3U файл
            </label>
            <input
              type="file"
              accept=".m3u,.m3u8"
              onChange={uploadM3U}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4 file:rounded-lg
                file:border-0 file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          {/* Manual Stream Input */}
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-4 block text-sm font-semibold text-foreground">
              Добавить потоки вручную
            </label>
            <div className="space-y-3">
              {streams.map((stream, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
                  <input
                    type="text"
                    value={stream.title}
                    onChange={(e) => updateStream(index, 'title', e.target.value)}
                    placeholder="Название (НТВ, Россия-1)"
                    className="sm:w-32 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  />
                  <input
                    type="text"
                    value={stream.url}
                    onChange={(e) => updateStream(index, 'url', e.target.value)}
                    placeholder="https://example.com/stream.m3u8"
                    className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  />
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
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить поток
            </Button>
          </div>

          {/* Generate Button */}
          <Button onClick={generateM3U} size="lg" className="w-full">
            Создать M3U плейлист
          </Button>

          {/* M3U Content Display */}
          {m3uContent && (
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="mb-3 block text-sm font-semibold text-foreground">
                Содержимое M3U плейлиста
              </label>
              <textarea
                value={m3uContent}
                readOnly
                className="h-48 w-full rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-foreground"
              />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Скопировано' : 'Скопировать'}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadM3U}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Скачать M3U
                </Button>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Как использовать плейлист:
                </p>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  <li>1. Скопируйте M3U содержимое выше</li>
                  <li>2. Сохраните его в текстовом редакторе как файл.m3u</li>
                  <li>3. Загрузите файл на облачное хранилище (Google Drive, Dropbox, etc.)</li>
                  <li>4. Получите прямую ссылку на файл</li>
                  <li>5. Вставьте ссылку в плеер на главной странице</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
