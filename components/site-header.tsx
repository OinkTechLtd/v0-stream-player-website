import { Play } from "lucide-react"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Главная навигация">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">StreamFlow</span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#player-input"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {'Плеер'}
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {'Как это работает'}
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </div>
      </nav>
    </header>
  )
}
