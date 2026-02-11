import { Play } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Play className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">StreamFlow</span>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {'Бесплатный онлайн плеер для просмотра потокового видео. Без рекламы, без регистрации.'}
        </p>
        <div className="text-xs text-muted-foreground/60">
          {`© ${new Date().getFullYear()} StreamFlow. Все права защищены.`}
        </div>
      </div>
    </footer>
  )
}
