"use client";
import React, { useEffect, useState } from "react";
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
import { Clock, MapPin, Star, Users, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getEventosAction, registerEventoAction } from './actions';
import { reportEventAction } from './actions';

const neonColors = ["neon-yellow", "neon-blue", "neon-red"];
function getRandomNeonColor(exclude: string): string {
  const filtered = neonColors.filter((c) => c !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function EventoCard({
  evento,
  onAgendar,
  onReport,
  isAuthenticated,
}: {
  evento: any;
  onAgendar: (evento: any) => void;
  onReport: (evento: any) => void;
  isAuthenticated: boolean;
}) {
  const [neon, setNeon] = React.useState("neon-yellow");
  const [isHovered, setIsHovered] = React.useState(false);
  const { user, isAuthenticated: authUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsHovered(true);
    setNeon((prev) => getRandomNeonColor(prev));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const images = [evento.image1, evento.image2, evento.image3].filter(Boolean);

  const horarios = evento.eventTimes.map((et: any) => {
    const { dayOfWeek, startTime, endTime } = et.availabilityPattern;
    return {
      day: dayNames[dayOfWeek] || `Día ${dayOfWeek}`,
      time: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`,
    };
  });

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 border-2 border-gray-300 ${
        isHovered ? neon : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-52">
        {/* Botón de reporte */}
        {isAuthenticated && (
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
            title="Reportar evento"
            onClick={(e) => {
              e.stopPropagation();
              onReport(evento);
            }}
          >
            !
          </button>
        )}
        {images.length > 1 ? (
          <Carousel>
            <CarouselContent>
              {images.map((img: string, idx: number) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full h-52">
                    <Image
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <Image
            src={images[0]}
            alt={evento.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{evento?.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <CardDescription>{evento?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {horarios.map((h: any, i: any) => (
            <div key={i} className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{h.day}</span>
              <Clock className="h-4 w-4 mx-2" />
              <span>{h.time}</span>
            </div>
          ))}
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{evento?.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>Máximo {evento.availableSpots || 20} participantes</span>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            Precio:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(evento.price)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => {
            if (!authUser || !user) {
              toast({
                title: "Inicia sesión",
                description: "Debes iniciar sesión para agendar eventos",
                variant: "destructive",
              });
              setTimeout(() => router.push("/login"), 1200);
              return;
            }
            onAgendar(evento);
          }}
        >
          Agendar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function EventosPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState<any | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportDescription, setReportDescription] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const result = await getEventosAction();
        if (result.success) {
          setEventos(result.data);
        } else {
          console.error("Error al cargar eventos:", result.error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los eventos.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error al cargar eventos", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los eventos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const confirmAgendar = (evento: any) => {
    setSelectedEvento(evento);
    setShowConfirmDialog(true);
  };

  const openReportDialog = (evento: any) => {
    setSelectedEvento(evento);
    setReportDescription("");
    setShowReportDialog(true);
  };

  const realizarAgendamiento = async () => {
    if (!selectedEvento || !user) return;

    const eventosReservados = JSON.parse(
      localStorage.getItem("eventosReservados") || "[]"
    );
    if (eventosReservados.some((e: any) => e.id === selectedEvento.id)) {
      toast({
        title: "Evento ya reservado",
        description: "Ya tienes una reserva para este evento.",
        variant: "destructive",
      });
      setShowConfirmDialog(false);
      return;
    }

    const booking_date = new Date().toISOString().split("T")[0];
    const now = new Date();
    const booking_time = now.toTimeString().split(" ")[0];

    try {
      const result = await registerEventoAction(
        selectedEvento.id,
        user.sub || user.username || user.email,
        booking_date,
        booking_time
      );

      if (result.success) {
        // Guardar en localStorage
        const nuevosEventosReservados = [...eventosReservados, {
          id: selectedEvento.id,
          name: selectedEvento.name,
          booking_date,
          booking_time
        }];
        localStorage.setItem('eventosReservados', JSON.stringify(nuevosEventosReservados));

        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al agendar el evento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al agendar:", error);
      toast({
        title: "Error",
        description: "Error al agendar el evento.",
        variant: "destructive",
      });
    }
  };

  const handleReportSubmit = async () => {
    if (!selectedEvento || !user) return;
    try {
      const result = await reportEventAction({
        id_event: selectedEvento.id,
        id_reporter: user.sub || user.username || user.email,
        description: reportDescription,
        state: "pending",
      });
      if (!result.success) throw new Error(result.error || "Error al crear el reporte");
      toast({
        title: "Reporte enviado",
        description: "Gracias por tu reporte.",
        variant: "default",
      });
      setShowReportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="relative h-[300px] mb-16">
        <Image
          src="/images/eventosimg.jpg"
          alt="Eventos en Bogotá"
          width={1920}
          height={600}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Eventos en Bogotá
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Descubre y participa en los mejores eventos de la ciudad
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {user?.roles.includes("ORGANIZER") && (
          <div className="mb-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg font-semibold animate-bounce"
            >
              <Link href="/eventos/crear">Crear evento</Link>
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-gray-600 mb-4" />
            <p className="text-lg text-gray-600">Cargando eventos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onAgendar={confirmAgendar}
                onReport={openReportDialog}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar reserva</DialogTitle>
            <DialogDescription>
              ¿Deseas reservar un cupo para el evento{" "}
              <strong>{selectedEvento?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={realizarAgendamiento}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserva confirmada</DialogTitle>
            <DialogDescription>
              Has reservado exitosamente tu lugar en el evento{" "}
              <strong>{selectedEvento?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary text-white"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de reporte */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar evento</DialogTitle>
            <DialogDescription>
              Describe el motivo del reporte para el evento{" "}
              <strong>{selectedEvento?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <textarea
            className="w-full border rounded p-2 mt-2"
            rows={4}
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Describe el problema..."
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleReportSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!reportDescription.trim()}
            >
              Enviar reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
