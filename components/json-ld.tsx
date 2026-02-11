export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "StreamFlow",
    description:
      "Бесплатный онлайн плеер для просмотра потокового видео. Вставьте ссылку на поток и смотрите видео прямо в браузере.",
    url: "https://streamflow.app",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
    featureList: [
      "HLS streaming support",
      "MP4 playback",
      "No registration required",
      "Free to use",
      "Mobile-friendly player",
    ],
    inLanguage: "ru",
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Какие форматы потоков поддерживаются?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "StreamFlow поддерживает большинство популярных форматов потокового видео, включая HLS (.m3u8), MP4, MPEG-TS (.ts) и другие.",
        },
      },
      {
        "@type": "Question",
        name: "Нужно ли регистрироваться?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Нет, регистрация не требуется. Просто вставьте ссылку и начните просмотр. StreamFlow полностью бесплатен.",
        },
      },
      {
        "@type": "Question",
        name: "Безопасно ли это?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, StreamFlow не хранит ваши данные и не отслеживает вашу активность. Все потоки проигрываются напрямую через ваш браузер.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}
