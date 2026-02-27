"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Play, Link as LinkIcon, X, ExternalLink, Share2, Copy, Check, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function buildPlayerUrl(fileUrl: string) {
  return `/embed/index.html?file=${encodeURIComponent(fileUrl)}`
}

function MobileShareButton({ streamUrl }: { streamUrl: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/player?url=${encodeURIComponent(streamUrl)}` : streamUrl

    if (navigator.share) {
      try {
        await navigator.share({ title: 'StreamFlow', url: shareUrl })
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Copy failed
      }
    }
  }, [streamUrl])

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Поделиться"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
    </button>
  )
}

export function StreamInput() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)
  const [playerUrl, setPlayerUrl] = useState("")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      const trimmed = url.trim()
      if (!trimmed) {
        setError("Введите ссылку на поток")
        return
      }

      try {
        new URL(trimmed)
      } catch {
        setError("Введите корректную ссылку (начинается с http:// или https://)")
        return
      }

      const builtUrl = buildPlayerUrl(trimmed)
      setPlayerUrl(builtUrl)

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768

      if (isMobile) {
        setShowMobilePlayer(true)
      } else {
        window.open(`/player?url=${encodeURIComponent(trimmed)}`, "_blank")
      }
    },
    [url]
  )

  return (
    <>
      <section id="player-input" className="relative px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="stream-url" className="sr-only">
              Ссылка на поток
            </label>
            <div className="group relative flex items-center">
              <LinkIcon className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                id="stream-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError("")
                }}
                placeholder="https://example.com/stream.m3u8"
                className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-lg"
                autoComplete="url"
                spellCheck={false}
              />
              {url && (
                <button
                  type="button"
                  onClick={() => {
                    setUrl("")
                    setError("")
                  }}
                  className="absolute right-4 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Очистить поле"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="h-14 flex-1 gap-2 rounded-xl text-base font-semibold"
              >
                <Play className="h-5 w-5" />
                Смотреть поток
              </Button>
              <Link href="/my-playlists" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-14 w-full gap-2 rounded-xl text-base font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  Мои плейлисты
                </Button>
              </Link>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-md bg-secondary px-2 py-1">.m3u8</span>
            <span className="rounded-md bg-secondary px-2 py-1">.mp4</span>
            <span className="rounded-md bg-secondary px-2 py-1">.ts</span>
            <span className="rounded-md bg-secondary px-2 py-1">HLS</span>
            <span className="rounded-md bg-secondary px-2 py-1">{'и другие форматы'}</span>
          </div>
        </div>
      </section>

      {/* Mobile overlay player */}
      {showMobilePlayer && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold text-foreground">
              StreamFlow Player
            </h2>
            <div className="flex items-center gap-2">
              <MobileShareButton streamUrl={url} />
              <a
                href={playerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Открыть в новой вкладке"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setShowMobilePlayer(false)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Закрыть плеер"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <iframe
              src={playerUrl}
              className="h-full w-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              title="Видеоплеер"
            />
          </div>
        </div>
      )}
    </>
  )
}
