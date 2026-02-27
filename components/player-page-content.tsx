"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useCallback } from "react"
import { Play, ArrowLeft, ExternalLink, CheckCircle2, Share2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function buildPlayerUrl(fileUrl: string) {
  return `/embed/index.html?file=${encodeURIComponent(fileUrl)}`
}

function ShareButton({ streamUrl }: { streamUrl: string }) {
  const [copied, setCopied] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/player?url=${encodeURIComponent(streamUrl)}`
    : ''

  const generateShareLink = useCallback(() => {
    setShowPopup(true)
  }, [])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs bg-transparent"
        onClick={generateShareLink}
      >
        <Share2 className="h-3.5 w-3.5" />
        Поделиться
      </Button>

      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopup(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setShowPopup(false) }}
            role="button"
            tabIndex={0}
            aria-label="Закрыть"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-2xl">
            <p className="mb-3 text-sm font-medium text-foreground">
              {"Ссылка для друзей"}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="h-9 flex-1 rounded-lg border border-border bg-secondary px-3 text-xs text-foreground"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="default"
                size="sm"
                className="h-9 shrink-0 gap-1.5"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Готово" : "Копировать"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {"Отправьте эту ссылку друзьям — они увидят тот же поток"}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function PlayerContent() {
  const searchParams = useSearchParams()
  const streamUrl = searchParams.get("url") || ""
  const playerUrl = streamUrl ? buildPlayerUrl(streamUrl) : ""

  if (!streamUrl) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Play className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {'Ссылка не указана'}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {'Перейдите на главную страницу и вставьте ссылку на поток для просмотра.'}
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Play className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold text-foreground">StreamFlow</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton streamUrl={streamUrl} />
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{'Назад'}</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Success notification */}
      <div className="border-b border-border bg-primary/5 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {'Поток успешно открыт в новой вкладке'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {'Плеер загружает ваш поток. Если видео не появилось, проверьте корректность ссылки.'}
            </p>
          </div>
          <a
            href={playerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-transparent">
              <ExternalLink className="h-3.5 w-3.5" />
              {'Открыть отдельно'}
            </Button>
          </a>
        </div>
      </div>

      {/* Player iframe */}
      <div className="flex-1 bg-background">
        <iframe
          src={playerUrl}
          className="h-full min-h-[calc(100vh-8rem)] w-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          title="Видеоплеер StreamFlow"
        />
      </div>

      {/* Stream info bar */}
      <div className="border-t border-border bg-card/50 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
          <p className="truncate text-xs text-muted-foreground" title={streamUrl}>
            {streamUrl}
          </p>
        </div>
      </div>
    </div>
  )
}

export function PlayerPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">{'Загрузка плеера...'}</span>
          </div>
        </div>
      }
    >
      <PlayerContent />
    </Suspense>
  )
}
