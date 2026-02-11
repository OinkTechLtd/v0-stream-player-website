import { ClipboardPaste, Play, Monitor } from "lucide-react"

const steps = [
  {
    icon: <ClipboardPaste className="h-6 w-6" />,
    step: "01",
    title: "Вставьте ссылку",
    description:
      "Скопируйте ссылку на поток (HLS, MP4, и др.) и вставьте в поле выше.",
  },
  {
    icon: <Play className="h-6 w-6" />,
    step: "02",
    title: "Нажмите «Смотреть»",
    description:
      "Нажмите кнопку и плеер мгновенно откроется с вашим потоком.",
  },
  {
    icon: <Monitor className="h-6 w-6" />,
    step: "03",
    title: "Наслаждайтесь",
    description:
      "На ПК поток откроется в новой вкладке, на мобильном — прямо поверх сайта.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {'Как это работает'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {'Три простых шага до просмотра'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {item.icon}
                </div>
                <span className="font-display text-3xl font-bold text-border">
                  {item.step}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
