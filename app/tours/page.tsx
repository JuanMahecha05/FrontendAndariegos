import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Star, Users, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ToursPage() {
  const officialTours = [
    {
      id: 1,
      title: 'Candelaria Histórica',
      description: 'Recorre el corazón histórico de Bogotá, visitando museos, iglesias coloniales y plazas emblemáticas.',
      image: 'https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg',
      duration: '3 horas',
      location: 'La Candelaria',
      rating: 4.9,
      price: 60000,
      events: [
        {
          title: 'Visita al Museo Botero',
          time: '10:00 - 11:30',
          description: 'Recorrido por la colección de arte del maestro Fernando Botero',
          image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'
        },
        {
          title: 'Tour por la Plaza de Bolívar',
          time: '11:45 - 12:45',
          description: 'Conoce la historia y arquitectura de la plaza principal de Bogotá',
          image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'
        },
        {
          title: 'Visita a la Catedral Primada',
          time: '13:00 - 14:00',
          description: 'Explora la catedral más importante de Colombia',
          image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'
        }
      ]
    },
    {
      id: 2,
      title: 'Grafiti Tour',
      description: 'Descubre el arte urbano que ha convertido a Bogotá en una referencia mundial del grafiti y el street art.',
      image: 'https://images.pexels.com/photos/14442358/pexels-photo-14442358.jpeg',
      duration: '2.5 horas',
      location: 'Centro y Chapinero',
      rating: 4.8,
      price: 55000,
      events: [
        {
          title: 'Taller de Grafiti',
          time: '14:00 - 15:30',
          description: 'Aprende las técnicas básicas del arte urbano'
        },
        {
          title: 'Recorrido por Murales',
          time: '15:45 - 17:00',
          description: 'Visita los murales más emblemáticos de la ciudad'
        }
      ]
    },
    {
      id: 3,
      title: 'Sabores Bogotanos',
      description: 'Prueba los mejores platos típicos de la capital colombiana en un recorrido gastronómico único.',
      image: 'https://images.pexels.com/photos/2338015/pexels-photo-2338015.jpeg',
      duration: '4 horas',
      location: 'Paloquemao y Centro',
      rating: 4.9,
      price: 85000,
      events: [
        {
          title: 'Mercado de Paloquemao',
          time: '09:00 - 10:30',
          description: 'Recorrido por el mercado más tradicional de Bogotá'
        },
        {
          title: 'Degustación de Frutas',
          time: '10:45 - 11:45',
          description: 'Prueba las frutas exóticas de Colombia'
        },
        {
          title: 'Almuerzo Típico',
          time: '12:00 - 13:30',
          description: 'Disfruta de los platos más representativos de la gastronomía bogotana'
        }
      ]
    }
  ]

  const userTours = [
    {
      id: 4,
      title: 'Monserrate y Centro',
      description: 'Sube al cerro de Monserrate y disfruta de las mejores vistas de la ciudad mientras conoces su historia.',
      image: 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg',
      duration: '5 horas',
      location: 'Monserrate y Centro',
      rating: 4.9,
      price: 95000,
      creator: 'Juan Pérez',
      creatorRating: 4.8,
      events: [
        {
          title: 'Subida a Monserrate',
          time: '09:00 - 11:00',
          description: 'Ascenso al cerro más emblemático de Bogotá'
        },
        {
          title: 'Visita al Santuario',
          time: '11:15 - 12:15',
          description: 'Conoce la historia y arquitectura del santuario'
        }
      ]
    },
    {
      id: 5,
      title: 'Tour Nocturno',
      description: 'Explora la vida nocturna de Bogotá, sus bares tradicionales y la cultura local.',
      image: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg',
      duration: '4 horas',
      location: 'Zona G y Chapinero',
      rating: 4.7,
      price: 75000,
      creator: 'María Rodríguez',
      creatorRating: 4.9,
      events: [
        {
          title: 'Recorrido por Bares',
          time: '20:00 - 23:00',
          description: 'Visita los bares más emblemáticos de la zona'
        }
      ]
    },
    {
      id: 6,
      title: 'Naturaleza y Aventura',
      description: 'Visita los parques naturales cercanos a Bogotá y disfruta de actividades al aire libre.',
      image: 'https://images.pexels.com/photos/6580703/pexels-photo-6580703.jpeg',
      duration: '8 horas',
      location: 'Alrededores de Bogotá',
      rating: 4.8,
      price: 120000,
      creator: 'Carlos Gómez',
      creatorRating: 4.7,
      events: [
        {
          title: 'Senderismo',
          time: '08:00 - 12:00',
          description: 'Recorrido por senderos naturales'
        },
        {
          title: 'Almuerzo Campestre',
          time: '12:30 - 14:00',
          description: 'Disfruta de un almuerzo en la naturaleza'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg"
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
      <div className="container mx-auto px-4 space-y-16">
        {/* Tours Oficiales */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Tours Oficiales</h2>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-medium">Tours verificados y garantizados</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officialTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} isOfficial={true} />
            ))}
          </div>
        </section>

        {/* Tours de Usuarios */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Tours de Usuarios</h2>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">Tours creados por la comunidad</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} isOfficial={false} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function TourCard({ tour, isOfficial }: { tour: any; isOfficial: boolean }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-52 w-full">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {isOfficial && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
            Oficial
          </div>
        )}
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
          {!isOfficial && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>Creado por {tour.creator} • {tour.creatorRating} ⭐</span>
            </div>
          )}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Eventos incluidos:</h4>
            <ul className="space-y-2">
              {tour.events?.map((event: any, index: number) => (
                <li key={index} className="text-sm text-gray-600">
                  • {event.title}
                </li>
              )) ?? <li className="text-sm text-gray-600">No hay eventos programados</li>}
            </ul>
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
        <div className="flex gap-2">
          <Link href={`/reservar-tour/${tour.id}`}>
            <Button variant="default">Reservar Tour</Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ver detalles</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">{tour.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{tour.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                    <span>{tour.rating}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <span className="text-lg font-semibold">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        maximumFractionDigits: 0
                      }).format(tour.price)}
                    </span>
                  </div>
                  {!isOfficial && (
                    <div className="col-span-2 flex items-center text-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Creado por {tour.creator} • {tour.creatorRating} ⭐</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-foreground">Plan del Tour:</h3>
                  <div className="space-y-4">
                    {tour.events?.map((event: any, index: number) => (
                      <div key={index} className="relative flex items-start bg-card rounded-lg shadow-sm overflow-hidden">
                        <div className="relative h-40" style={{ width: '50%', minWidth: '160px', maxWidth: '320px' }}>
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.0) 100%)',
                            width: '100%',
                            height: '100%'
                          }} />
                          <div className="absolute top-2 left-2 w-8 h-8 bg-primary/90 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-grow p-4">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                          <p className="text-sm mt-1 text-foreground">{event.description}</p>
                        </div>
                      </div>
                    )) ?? <p className="text-sm text-muted-foreground">No hay eventos programados</p>}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Link href={`/reservar-tour/${tour.id}`}>
                    <Button variant="default">Reservar Tour</Button>
                  </Link>
                  <Button variant="outline">Compartir</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}