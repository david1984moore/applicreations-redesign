import { Hero } from "@/components/sections/Hero"
import Problems from "@/components/sections/Problems"
import Solutions from "@/components/sections/Solutions"
import { Services } from "@/components/sections/Services"
import { Pricing } from "@/components/sections/Pricing"
import FAQ from "@/components/sections/FAQ"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problems />
      <Solutions />
      <Services />
      <Pricing />
      <FAQ />
    </main>
  )
}
