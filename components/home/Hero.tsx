import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with darker overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('/images/bogotabanner.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3)' // Darkened overlay for better text contrast
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fadeIn drop-shadow-lg">
            Descubre Bogotá, a tu ritmo, en las actividades que quieras
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 animate-fadeIn animation-delay-200 drop-shadow-lg">
            Personaliza tus tours para vivir la auténtica experiencia bogotana, decidiendo experimentar desde sus calles históricas hasta sus paisajes naturales.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn animation-delay-400">
            <Button asChild size="lg" className="text-lg px-8 py-6 border-2 border-yellow-600 bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <Link href="/tours">
                Reserva tu tour
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-red-500 text-white bg-red-600 hover:bg-red-700">
              <Link href="/crear-tour">
                Crea tu experiencia
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce transform">
        <span className="text-white text-sm mb-2 drop-shadow-lg">Desplázate</span>
        <svg 
          className="w-6 h-6 text-white drop-shadow-lg" 
          fill="none" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}