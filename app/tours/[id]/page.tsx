'use client'

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
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EventType = {
  idEvent: number;
  nameEvent: string;
  description: string;
  image: string;
  address: string;
  price: number;
};

type TourType = {
  idTour: number;
  name: string;
  description: string;
  events: EventType[];
};

type Props = {
  params: { id: string };
};

export default function TourDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [tour, setTour] = useState<TourType | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/tours/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al cargar el tour");

        const data = await res.json();
        setTour(data);
      } catch (error) {
        console.error("Error al obtener tour:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTour();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 mt-16 text-center">
        <h1 className="text-lg text-muted-foreground">Cargando tour...</h1>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto py-10 mt-16 text-center">
        <h1 className="text-lg text-destructive">No se encontró el tour</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-10">
      <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.push('/tours')}>
        <ArrowLeft className="h-4 w-4" />
        Volver a Tours
      </Button>

      <Carousel className="w-full rounded-lg overflow-hidden">
        <CarouselContent>
          {tour.events.length > 0 ? tour.events.map((event, index) => (
            <CarouselItem key={index} className="relative h-80">
              <Image src={event.image} alt={event.nameEvent} fill className="object-cover" />
            </CarouselItem>
          )) : (
            <CarouselItem className="relative h-80">
              <Image src="https://via.placeholder.com/600x400" alt="Sin imagen" fill className="object-cover" />
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>

      <h1 className="text-4xl font-bold text-primary">{tour.name}</h1>
      <p className="text-lg text-muted-foreground">{tour.description}</p>

      <div>
        <h2 className="text-2xl font-bold mb-4">Eventos del tour</h2>
        <div className="space-y-4">
          {tour.events.map((event, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border shadow-sm">
              <div className="relative h-32 w-1/2">
                <img src={event.image} alt={event.nameEvent} className="w-full h-full object-cover rounded-l-md" />
              </div>
              <div className="pl-6">
                <h4 className="font-medium text-lg text-primary">{event.nameEvent}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.address}</span>
                </div>
                <p className="text-sm">{event.description}</p>
                <p className="text-sm font-semibold mt-1">
                  Precio: {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(event.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Precio Total</CardTitle>
          <CardDescription>Suma del valor de todos los eventos incluidos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(tour.events.reduce((sum, e) => sum + e.price, 0))}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Editar Tour</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tour</DialogTitle>
              <DialogDescription>¿Deseas editar el tour <strong>{tour.name}</strong>?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href={`/editar-tour/${tour.idTour}`}>Editar</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
