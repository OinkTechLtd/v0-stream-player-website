"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Play, Link as LinkIcon, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

function buildPlayerUrl(fileUrl: string) {
  return `/embed/player.html?file=${encodeURIComponent(fileUrl)}`
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

            <Button
              type="submit"
              size="lg"
              className="h-14 gap-2 rounded-xl text-base font-semibold"
            >
              <Play className="h-5 w-5" />
              Смотреть поток
            </Button>
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
