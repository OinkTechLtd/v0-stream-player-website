import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { StreamInput } from "@/components/stream-input"
import { HowItWorks } from "@/components/how-it-works"
import { FaqSection } from "@/components/faq-section"
import { SiteFooter } from "@/components/site-footer"
import { JsonLd } from "@/components/json-ld"

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <HeroSection />
        <StreamInput />
        <HowItWorks />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
