import { notFound } from "next/navigation"
import Image from "next/image"
import Link from 'next/link'
import { officialTours, UserTour, userTours } from "@/data/tours"
import { Clock, MapPin, Star, Users } from "lucide-react"
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TourDetailPage({ params }: Props) {
  const { id } = await Promise.resolve(params).then(p => p);
  const tourId = parseInt(id);
  const tour = [...officialTours, ...userTours].find(t => t.id === tourId)

  if (!tour) return notFound();

  const images = [tour.image, ...tour.events.map(e => e.image)]

  function isUserTour(tour: any): tour is UserTour {
    return "creator" in tour && "creatorRating" in tour
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-10">

      {/* Carrusel */}
      <div className="relative">
        <Carousel className="w-full rounded-lg overflow-hidden">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="relative h-80">
                <Image src={image ?? ""} alt={`Imagen ${index + 1}`} fill className="object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-primary dark:text-white">{tour.title}</h1>

        {/* Dialog para Confirmar Reserva */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Agendar Tour</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Reserva</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas agendar <strong>{tour.title}</strong> por{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }).format(tour.price)}
                ?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href={`/agendar-tour/${tour.id}`}>Confirmar</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <p className="text-lg text-muted-foreground">{tour.description}</p>

      {/* Datos principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base text-foreground font-semibold">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>{tour.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{tour.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              maximumFractionDigits: 0,
            }).format(tour.price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span>{tour.rating}</span>
        </div>
      </div>

      {/* Info de creador si es tour de usuario */}
      {isUserTour(tour) && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="h-4 w-4" />
          <span>
            Creado por <span className="font-medium">{tour.creator}</span> • {tour.creatorRating} ⭐
          </span>
        </div>
      )}

      {/* Eventos del tour */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-white">Eventos del tour</h2>
        <div className="space-y-6">
          {tour.events?.map((event, index) => (
            <div key={index} className="rounded-md border p-4 shadow-sm bg-gray-50 dark:bg-muted">
              <h3 className="text-lg font-semibold text-foreground dark:text-white">{event.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">{event.time}</p>
              <p className="text-sm mt-1 text-foreground dark:text-gray-200">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
