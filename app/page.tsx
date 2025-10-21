import { Hero } from "@/components/sections/Hero"
import Problems from "@/components/sections/Problems"
import Solutions from "@/components/sections/Solutions"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problems />
      <Solutions />
    </main>
  )
}
