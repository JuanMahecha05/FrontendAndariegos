"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious
} from "@/components/ui/carousel";
import { ArrowLeft, MapPin, Clock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default function TourDetailPage({ params }: Props) {
  const { id } = params;
  const { token } = useAuth();
  const router = useRouter();
  const [tour, setTour] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tours/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("No se pudo cargar el tour");
        const data = await res.json();
        setTour(data);
      } catch (err) {
        setError("No se pudo cargar el tour. Intenta más tarde.");
      }
    };

    if (token) {
      fetchTour();
    }
  }, [id, token]);

  if (error) {
    return (
      <div className="container mx-auto py-10 mt-16 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Button className="mt-4" onClick={() => router.push('/tours')}>Volver a Tours</Button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto py-10 mt-16 text-center">
        <h1 className="text-lg text-muted-foreground">Cargando tour...</h1>
      </div>
    );
  }

  const images = [tour.image, ...(tour.events?.map((e: { image: string }) => e.image) || [])];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-10">
      <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.push('/tours')}>
        <ArrowLeft className="h-4 w-4" />
        Volver a Tours
      </Button>

      {/* Carrusel */}
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

      <h1 className="text-4xl font-bold text-primary">{tour.title}</h1>
      <p className="text-lg text-muted-foreground">{tour.description}</p>

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

      <div>
        <h2 className="text-2xl font-bold mb-4">Eventos del tour</h2>
        <div className="space-y-4">
          {tour.events?.map((event: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border shadow-sm">
              <div className="relative h-32 w-1/2">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-l-md" />
              </div>
              <div className="pl-6">
                <h4 className="font-medium text-lg text-primary">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.time}</p>
                <p className="text-sm mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {/* Botón de editar */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Editar Tour</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tour</DialogTitle>
              <DialogDescription>¿Deseas editar el tour <strong>{tour.title}</strong>?</DialogDescription>
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
