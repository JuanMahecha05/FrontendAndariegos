import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Star, Users } from 'lucide-react'

export default function ToursPage() {
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
    },
    {
      id: 4,
      title: 'Monserrate y Centro',
      description: 'Sube al cerro de Monserrate y disfruta de las mejores vistas de la ciudad mientras conoces su historia.',
      image: 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg',
      duration: '5 horas',
      location: 'Monserrate y Centro',
      rating: 4.9,
      groupSize: '1-10 personas',
      price: 95000
    },
    {
      id: 5,
      title: 'Tour Nocturno',
      description: 'Explora la vida nocturna de Bogotá, sus bares tradicionales y la cultura local.',
      image: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg',
      duration: '4 horas',
      location: 'Zona G y Chapinero',
      rating: 4.7,
      groupSize: '1-8 personas',
      price: 75000
    },
    {
      id: 6,
      title: 'Naturaleza y Aventura',
      description: 'Visita los parques naturales cercanos a Bogotá y disfruta de actividades al aire libre.',
      image: 'https://images.pexels.com/photos/6580703/pexels-photo-6580703.jpeg',
      duration: '8 horas',
      location: 'Alrededores de Bogotá',
      rating: 4.8,
      groupSize: '1-6 personas',
      price: 120000
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/3588475/pexels-photo-3588475.jpeg"
          alt="Tours en Bogotá"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tours en Bogotá</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Explora la capital colombiana con nuestros tours guiados
            </p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4">
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
      </div>
    </div>
  )
}