"use client"

import React from "react"

import { Play, Tv, Zap, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[40vh] flex-col items-center justify-center px-4 pt-32 pb-16 text-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>{'Быстрый и бесплатный стрим-плеер'}</span>
        </div>
        <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          {'Смотрите потоки'}
          <br />
          <span className="text-primary">{'прямо в браузере'}</span>
        </h1>
        <p className="max-w-xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          {'Вставьте ссылку на поток и мгновенно начните просмотр. Никаких загрузок, регистраций или ограничений.'}
        </p>
      </div>
      <div className="relative z-10 mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<Play className="h-5 w-5" />}
          title="Мгновенный запуск"
          description="Вставьте ссылку и смотрите за секунду"
        />
        <FeatureCard
          icon={<Tv className="h-5 w-5" />}
          title="Любые форматы"
          description="HLS, MP4, и другие потоковые форматы"
        />
        <FeatureCard
          icon={<Shield className="h-5 w-5" />}
          title="Безопасно"
          description="Без рекламы, вирусов и скрытых угроз"
        />
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-6 text-center transition-colors hover:border-primary/30 hover:bg-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
