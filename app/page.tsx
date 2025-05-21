import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"
import { FeaturedTours } from "@/components/home/FeaturedTours"
import { Testimonials } from "@/components/home/Testimonials"
import { CallToAction } from "@/components/home/CallToAction"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedTours />
      <Testimonials />
      <CallToAction />
    </>
  )
}