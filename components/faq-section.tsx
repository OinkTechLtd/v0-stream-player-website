"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Какие форматы потоков поддерживаются?",
    answer:
      "StreamFlow поддерживает большинство популярных форматов потокового видео, включая HLS (.m3u8), MP4, MPEG-TS (.ts) и другие. Просто вставьте прямую ссылку на файл потока.",
  },
  {
    question: "Нужно ли регистрироваться?",
    answer:
      "Нет, регистрация не требуется. Просто вставьте ссылку и начните просмотр. StreamFlow полностью бесплатен.",
  },
  {
    question: "Как работает плеер на мобильных устройствах?",
    answer:
      "На мобильных устройствах плеер открывается поверх сайта в полноэкранном режиме. Вы можете закрыть его в любой момент, нажав на кнопку закрытия.",
  },
  {
    question: "Как работает плеер на ПК?",
    answer:
      "На ПК плеер открывается в новой вкладке браузера. На текущей странице появится уведомление о том, что поток открыт в новой вкладке.",
  },
  {
    question: "Безопасно ли это?",
    answer:
      "Да, StreamFlow не хранит ваши данные и не отслеживает вашу активность. Все потоки проигрываются напрямую через ваш браузер.",
  },
  {
    question: "Почему поток не воспроизводится?",
    answer:
      "Убедитесь, что ссылка корректна и ведёт на прямой поток (не на страницу с плеером). Также проверьте, что источник потока доступен и не заблокирован.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {'Частые вопросы'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {'Ответы на популярные вопросы о StreamFlow'}
          </p>
        </div>
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-border bg-card/50 px-6 transition-colors data-[state=open]:border-primary/30 data-[state=open]:bg-card"
            >
              <AccordionTrigger className="py-5 text-left font-display text-sm font-semibold text-foreground hover:no-underline md:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
