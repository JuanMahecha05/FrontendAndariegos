"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { officialTours } from "@/data/tours";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Star, Users } from "lucide-react";
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>;
};

export default function TourDetailPage({ params }: Props) {
  const { id } = React.use(params);
  const tourId = parseInt(id);
  const [tour, setTour] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar tours desde localStorage o usar los oficiales
    let tours = officialTours;
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('tours');
      if (local) {
        tours = JSON.parse(local);
      }
    }
    const foundTour = tours.find(t => t.id === tourId);
    setTour(foundTour);
  }, [tourId]);

  if (!tour) {
    return (
      <div className="container mx-auto py-10 mt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Tour no encontrado</h1>
          <p className="mt-4">El tour que buscas no existe o ha sido eliminado.</p>
          <Button className="mt-4" onClick={() => router.push('/tours')}>
            Volver a Tours
          </Button>
        </div>
      </div>
    );
  }

  const images = [tour.image, ...(tour.events?.map((e: { image: string }) => e.image) || [])];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-10">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push('/tours')}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Tours
        </Button>
      </div>

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

      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold text-primary dark:text-white">{tour.title}</h1>
      </div>

      <p className="text-lg text-muted-foreground">{tour.description}</p>

      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{tour.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span>{tour.rating}</span>
        </div>
      </div>

      {/* Eventos del tour */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-white">Eventos del tour</h2>
        <div className="space-y-4">
          {tour.events?.map((event: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border shadow-sm">
              <div className="flex-grow relative h-32">
                <div className="absolute inset-0 w-1/2">
                  <div className="relative w-full h-full">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-l-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-1/2" />
                  <div className="flex-grow pl-8">
                    <h4 className="font-medium text-lg text-primary">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.time}
                    </p>
                    <p className="text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen del tour */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ubicaciones</CardTitle>
            <CardDescription>Punto de inicio y final del tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                <span>Inicio: {tour.events[0]?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span>Final: {tour.events[tour.events.length - 1]?.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precio</CardTitle>
            <CardDescription>Incluye todos los eventos del tour</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(tour.price)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botón de editar al final */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Editar Tour</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tour</DialogTitle>
              <DialogDescription>
                ¿Deseas editar el tour <strong>{tour.title}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href={`/editar-tour/${tour.id}`}>Editar</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
