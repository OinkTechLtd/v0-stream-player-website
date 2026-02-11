import { redirect } from "next/navigation"
import type { Metadata } from "next"

function decodeId(id: string): string | null {
  try {
    let base64 = id.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4 !== 0) {
      base64 += "="
    }
    return Buffer.from(base64, "base64").toString("utf-8")
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const streamUrl = decodeId(id)

  return {
    title: "StreamFlow — Смотреть поток",
    description: streamUrl
      ? `Смотрите потоковое видео онлайн в плеере StreamFlow.`
      : "Ссылка на поток недействительна.",
    openGraph: {
      title: "StreamFlow — Смотреть поток",
      description: "Вам поделились потоковым видео. Нажмите, чтобы посмотреть.",
      type: "website",
      siteName: "StreamFlow",
    },
    twitter: {
      card: "summary",
      title: "StreamFlow — Смотреть поток",
      description: "Вам поделились потоковым видео. Нажмите, чтобы посмотреть.",
    },
  }
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const streamUrl = decodeId(id)

  if (!streamUrl) {
    redirect("/")
  }

  try {
    new URL(streamUrl)
  } catch {
    redirect("/")
  }

  redirect(`/player?url=${encodeURIComponent(streamUrl)}`)
}
