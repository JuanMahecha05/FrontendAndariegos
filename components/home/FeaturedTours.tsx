import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Star, Users } from 'lucide-react'

export function FeaturedTours() {
  const tours = [
    {
      id: 1,
      title: 'Candelaria Histórica',
      description: 'Recorre el corazón histórico de Bogotá, visitando museos, iglesias coloniales y plazas emblemáticas.',
      image: 'https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg',
      duration: '3 horas',
      location: 'La Candelaria',
      rating: 4.9,
      groupSize: '1-10 personas',
      price: 60000
    },
    {
      id: 2,
      title: 'Grafiti Tour',
      description: 'Descubre el arte urbano que ha convertido a Bogotá en una referencia mundial del grafiti y el street art.',
      image: 'https://images.pexels.com/photos/14442358/pexels-photo-14442358.jpeg',
      duration: '2.5 horas',
      location: 'Centro y Chapinero',
      rating: 4.8,
      groupSize: '1-12 personas',
      price: 55000
    },
    {
      id: 3,
      title: 'Sabores Bogotanos',
      description: 'Prueba los mejores platos típicos de la capital colombiana en un recorrido gastronómico único.',
      image: 'https://images.pexels.com/photos/2338015/pexels-photo-2338015.jpeg',
      duration: '4 horas',
      location: 'Paloquemao y Centro',
      rating: 4.9,
      groupSize: '1-8 personas',
      price: 85000
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tours Destacados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estas son algunas de nuestras experiencias más populares en Bogotá
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative h-52 w-full">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                  </div>
                </div>
                <CardDescription>{tour.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{tour.groupSize}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0
                  }).format(tour.price)}
                </div>
                <Button asChild>
                  <Link href={`/tours/${tour.id}`}>Ver detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/tours">Ver todos los tours</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}