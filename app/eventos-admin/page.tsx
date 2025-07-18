"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Star,
  Users,
  Calendar,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getEventosWithAttendeesAction, deleteEventAction } from "@/app/eventos/actions";

type Attendee = {
  id: number;
  name: string;
  email: string;
};

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type EventTime = {
  id: number;
  availabilityPattern: Availability;
};

interface Evento {
  id: number;
  name: string;
  description: string;
  image1: string;
  price: number;
  date: string | null;
  city: string;
  address: string;
  availableSpots: number | null;
  eventTimes: EventTime[];
  inscritos?: Attendee[];
}

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function formatTimeSlot(availability: Availability) {
  const day = weekDays[availability.dayOfWeek - 1];
  const start = availability.startTime?.slice(0, 5);
  const end = availability.endTime?.slice(0, 5);
  return `${day}: ${start} - ${end}`;
}

export default function EventosAdminPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventoExpandido, setEventoExpandido] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles?.includes("ORGANIZER") && !user?.roles?.includes("ADMIN")) {
      router.push("/");
      return;
    }

    const fetchEventos = async () => {
      try {
        const result = await getEventosWithAttendeesAction();
        if (result.success && result.data) {
          setEventos(result.data);
        } else {
          toast({
            title: "Error al cargar eventos",
            description: result.error || "Intenta nuevamente más tarde.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error al cargar eventos",
          description: "Intenta nuevamente más tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [isAuthenticated, user, router, toast]);

  const handleEdit = (eventId: number) => {
    router.push(`/eventos/editar/${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este evento?")) return;

    try {
      const result = await deleteEventAction(eventId);
      if (result.success) {
        setEventos(eventos.filter((evento) => evento.id !== eventId));
        toast({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado exitosamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo eliminar el evento.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento.",
        variant: "destructive",
      });
    }
  };

  const toggleExpandirEvento = (eventoId: number) => {
    setEventoExpandido(eventoExpandido === eventoId ? null : eventoId);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="relative h-[300px] mb-16">
        <Image
          src="/images/eventosimg.jpg"
          alt="Administración de Eventos"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Administración de Eventos
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Gestiona todos los eventos y visualiza los participantes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-10 flex justify-center">
          <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold">
            <Link href="/eventos/crear">Crear nuevo evento</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {eventos.map((evento) => (
            <Card key={evento.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image
                    src={evento.image1}
                    alt={evento.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{evento.name}</CardTitle>
                        <CardDescription className="mt-2">{evento.description}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{evento.date || "Sin fecha"}</span>
                        </div>
                        <div className="flex items-start text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 mt-1" />
                          <div>
                            {evento.eventTimes.length > 0 ? (
                              <ul className="list-disc ml-4">
                                {evento.eventTimes.map((et) => (
                                  <li key={et.id}>{formatTimeSlot(et.availabilityPattern)}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>–</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{evento.city}, {evento.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{evento.inscritos?.length || 0} / {evento.availableSpots || "–"} participantes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => toggleExpandirEvento(evento.id)} className="flex items-center">
                      {eventoExpandido === evento.id ? (
                        <>
                          Ocultar inscritos <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Ver inscritos <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => handleEdit(evento.id)}>Editar</Button>
                      <Button variant="destructive" onClick={() => handleDelete(evento.id)}>Eliminar</Button>
                    </div>
                  </CardFooter>
                </div>
              </div>
              {eventoExpandido === evento.id && (
                <div className="border-t p-4">
                  <h3 className="text-lg font-semibold mb-4">Participantes inscritos</h3>
                  {evento.inscritos && evento.inscritos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {evento.inscritos.map((inscrito) => (
                        <div key={inscrito.id} className="p-3 bg-secondary rounded-lg">
                          <p className="font-medium">{inscrito.name}</p>
                          <p className="text-sm text-gray-500">{inscrito.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay participantes inscritos aún.</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}