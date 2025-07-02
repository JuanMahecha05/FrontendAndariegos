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
import { Clock, MapPin, Users, Calendar, Loader2 } from "lucide-react"; // ← Loader2 incluido
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

type EventoReservado = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  image: string;
};

export default function EventosReservadosPage() {
  const [eventosReservados, setEventosReservados] = useState<EventoReservado[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ← estado agregado
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  useEffect(() => {
    const fetchReservasDelUsuario = async () => {
      try {
        const eventosRes = await fetch(`${API_URL}/events`);
        const eventos = await eventosRes.json();

        const reservasUsuario: EventoReservado[] = [];

        for (const evento of eventos) {
          const asistentesRes = await fetch(
            `${API_URL}/events/registration/attendees/${evento.id}`
          );

          if (!asistentesRes.ok) continue;

          const asistentes = await asistentesRes.json();

          const estaRegistrado = asistentes.find(
            (a: any) => a.userId === user.sub
          );

          if (estaRegistrado) {
            reservasUsuario.push({
              id: evento.id,
              title: evento.name,
              description: evento.description,
              date: estaRegistrado.booking_date || "Sin fecha",
              time: estaRegistrado.booking_time || "Sin hora",
              location: `${evento.city || "Sin ciudad"}, ${evento.address || "Sin dirección"}`,
              maxParticipants: evento.maxParticipants || 20,
              image: evento.image1 || "https://via.placeholder.com/400x300",
            });
          }
        }

        setEventosReservados(reservasUsuario);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar tus reservas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // ← marcamos que terminó de cargar
      }
    };

    fetchReservasDelUsuario();
  }, [user, toast]);

  const handleCancelarReserva = (eventoId: number) => {
    const eventosActualizados = eventosReservados.filter((e) => e.id !== eventoId);
    setEventosReservados(eventosActualizados);

    toast({
      title: "Reserva cancelada",
      description: "Has cancelado tu reserva exitosamente.",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-gray-600 mb-4" />
            <p className="text-lg text-gray-600">Cargando tus reservas...</p>
          </div>
        ) : eventosReservados.length === 0 ? (
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
            {eventosReservados.map((evento) => (
              <Card key={evento.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={evento.image}
                    alt={evento.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{evento.title}</CardTitle>
                  <CardDescription>{evento.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{evento.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{evento.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{evento.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Máximo {evento.maxParticipants} participantes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelarReserva(evento.id)}
                  >
                    Cancelar Reserva
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
