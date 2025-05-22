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

export default function EventosReservadosPage() {
  const [eventosReservados, setEventosReservados] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  console.log("user", user);

  // Verificar autenticación
  if (!user) {
    // router.push("/login");
    return null;
  }

  useEffect(() => {
    // Obtener eventos reservados del localStorage
    const eventos = JSON.parse(
      localStorage.getItem("eventosReservados") || "[]"
    );
    setEventosReservados(eventos);
  }, []);

  const handleCancelarReserva = (eventoId: number) => {
    // Obtener eventos actuales
    const eventos = JSON.parse(
      localStorage.getItem("eventosReservados") || "[]"
    );

    // Filtrar el evento a cancelar
    const eventosActualizados = eventos.filter((e: any) => e.id !== eventoId);

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
            {eventosReservados.map((evento: any) => (
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
