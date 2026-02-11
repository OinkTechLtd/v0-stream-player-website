import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'StreamFlow — Онлайн плеер потокового видео',
  description: 'Бесплатный онлайн плеер для просмотра потокового видео. Вставьте ссылку на поток и смотрите видео прямо в браузере. Поддержка HLS, MP4 и других форматов.',
  keywords: ['онлайн плеер', 'потоковое видео', 'стрим плеер', 'HLS плеер', 'видеоплеер онлайн', 'stream player', 'video player'],
  authors: [{ name: 'StreamFlow' }],
  openGraph: {
    title: 'StreamFlow — Онлайн плеер потокового видео',
    description: 'Бесплатный онлайн плеер для просмотра потокового видео. Вставьте ссылку и смотрите.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'StreamFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamFlow — Онлайн плеер потокового видео',
    description: 'Бесплатный онлайн плеер для просмотра потокового видео.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0c10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href="https://streamflow.app" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
