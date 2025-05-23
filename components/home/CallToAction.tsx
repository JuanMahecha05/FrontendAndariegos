import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CallToAction() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Listo para explorar Bogotá?
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Reserva uno de nuestros tours o crea tu propia experiencia personalizada.
          Estamos listos para mostrarte la verdadera esencia de nuestra ciudad.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Link href="/tours">Explorar Tours</Link>
          </Button>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Link href="/register">Crear Cuenta</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}