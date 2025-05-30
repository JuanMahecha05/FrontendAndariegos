"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Star, Users, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { CarouselImages } from '@/components/ui/carousel';

export default function EventosReservadosPage() {
  const [eventosReservados, setEventosReservados] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Obtener eventos reservados del localStorage
    const eventosLS = JSON.parse(localStorage.getItem("eventosReservados") || "[]");
    // Obtener tours reservados mock de window (creados en crear-tour)
    let eventosMock: any[] = [];
    if (typeof window !== 'undefined' && (window as any).eventosReservados) {
      eventosMock = (window as any).eventosReservados;
    }
    setEventosReservados([...eventosLS, ...eventosMock]);
  }, []);

  const handleCancelarReserva = (eventoId: any) => {
    // Obtener eventos actuales
    const eventos = JSON.parse(
      localStorage.getItem("eventosReservados") || "[]"
    );

    // Filtrar el evento/tour a cancelar
    const eventosActualizados = eventos.filter((e: any) => {
      // Si es un tour, comparar por id o title
      if ((e.eventSequence?.length || e.events?.length)) {
        return (e.id || e.title) !== (eventoId.id || eventoId.title);
      }
      // Si es un evento suelto, comparar por id
      return e.id !== eventoId.id && e.id !== eventoId;
    });

    // Guardar en localStorage
    localStorage.setItem(
      "eventosReservados",
      JSON.stringify(eventosActualizados)
    );

    // Actualizar el estado
    setEventosReservados(eventosActualizados);

    toast({
      title: "Reserva cancelada",
      description: "Has cancelado tu reserva exitosamente.",
    });
  };
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg"
          alt="Mis Eventos Reservados"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mis Eventos Reservados
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Gestiona tus reservas y experiencias
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {eventosReservados.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-gray-600">
              No tienes eventos reservados
            </h2>
            <p className="mt-2 text-gray-500">
              ¡Explora nuestros eventos y haz tu primera reserva!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosReservados.map((evento: any) => {
              // Si es un tour reservado (tiene eventSequence o events), mostrar info especial
              const eventosTour = evento.eventSequence?.length
                ? evento.eventSequence
                : evento.events?.length
                  ? evento.events
                  : null;
              const images = eventosTour
                ? eventosTour.map((ev: any) => ({ src: ev.imagen || ev.image, alt: ev.nombre || ev.title }))
                : [{ src: evento.imagen || evento.image, alt: evento.nombre || evento.title }];
              const fechaInicio = eventosTour?.[0]?.fecha || eventosTour?.[0]?.date || evento.fecha || evento.date;
              const duracionTotal = eventosTour
                ? eventosTour.reduce((sum: number, ev: any) => sum + (ev.duracion || ev.duration || 0), 0)
                : evento.duracion || evento.duration;
              return (
                <Card key={evento.id || evento.title} className="overflow-hidden">
                  <div className="relative h-48">
                    <CarouselImages images={images} />
                  </div>
                  <CardHeader>
                    <CardTitle>{evento.title || evento.nombre}</CardTitle>
                    <CardDescription>{evento.description || evento.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{fechaInicio ? `Fecha de inicio: ${fechaInicio}` : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{duracionTotal ? `Duración total: ${duracionTotal} horas` : ''}</span>
                      </div>
                      {eventosTour && (
                        <div>
                          <h4 className="font-semibold mt-2 mb-1">Eventos incluidos:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {eventosTour.map((ev: any, idx: number) => (
                              <li key={idx}>{ev.nombre || ev.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleCancelarReserva(evento)}
                    >
                      Cancelar Reserva
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
