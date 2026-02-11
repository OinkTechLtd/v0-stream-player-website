import type { Metadata } from "next"
import { PlayerPageContent } from "@/components/player-page-content"

export const metadata: Metadata = {
  title: "StreamFlow — Плеер",
  description: "Просмотр потокового видео в онлайн плеере StreamFlow.",
  robots: { index: false, follow: false },
}

export default function PlayerPage() {
  return <PlayerPageContent />
}
