import { Hero } from "@/components/sections/Hero"
import Problems from "@/components/sections/Problems"
import Solutions from "@/components/sections/Solutions"
import { Services } from "@/components/sections/Services"
import { Pricing } from "@/components/sections/Pricing"
import FAQ from "@/components/sections/FAQ"
import FinalCTA from "@/components/sections/FinalCTA"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problems />
      <Solutions />
      <Services />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  )
}
