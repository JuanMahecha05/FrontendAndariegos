"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Star, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const neonColors = ['neon-yellow', 'neon-blue', 'neon-red'];
function getRandomNeonColor(exclude: string): string {
  const filtered = neonColors.filter(c => c !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

function EventoCard({ evento, onAgendar }: { evento: any; onAgendar: (evento: any) => void }) {
  const [neon, setNeon] = React.useState('neon-yellow');
  const [isHovered, setIsHovered] = React.useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsHovered(true);
    setNeon(prev => getRandomNeonColor(prev));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 border-2 border-gray-300 ${isHovered ? neon : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-52 w-full">
        <Image
          src={evento.image1}
          alt={evento.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{evento.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <CardDescription>{evento.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {evento.eventTimes.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Día: {evento.eventTimes[0].availabilityPattern.dayOfWeek}</span>
            </div>
          )}
          {evento.eventTimes.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {evento.eventTimes[0].availabilityPattern.startTime.slice(0, 5)} - {evento.eventTimes[0].availabilityPattern.endTime.slice(0, 5)}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{evento.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>Máximo {evento.availableSpots || 20} participantes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => {
            if (!isAuthenticated || !user) {
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
  const [selectedEvento, setSelectedEvento] = useState<any | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false); // 🔥 Nuevo estado

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error al cargar eventos", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los eventos.",
          variant: "destructive",
        });
      }
    };
    fetchEventos();
  }, []);

  const confirmAgendar = (evento: any) => {
    setSelectedEvento(evento);
    setShowConfirmDialog(true);
  };

  const realizarAgendamiento = async () => {
    if (!selectedEvento || !user) return;

    const eventosReservados = JSON.parse(localStorage.getItem('eventosReservados') || '[]');
    if (eventosReservados.some((e: any) => e.id === selectedEvento.id)) {
      toast({
        title: "Evento ya reservado",
        description: "Ya tienes una reserva para este evento.",
        variant: "destructive"
      });
      setShowConfirmDialog(false);
      return;
    }

    const booking_date = new Date().toISOString().split('T')[0];
    const booking_time = "11:00";

    try {
      const response = await fetch(`${API_URL}/events/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvento.id,
          userId: user.username || user.email || user.name,
          booking_time,
          booking_date
        })
      });

      if (!response.ok) throw new Error("Error al agendar");

      eventosReservados.push(selectedEvento);
      localStorage.setItem('eventosReservados', JSON.stringify(eventosReservados));

      setShowSuccessDialog(true); // ✅ Mostrar diálogo de éxito
    } catch (error) {
      console.error("Error al agendar evento:", error);
      toast({
        title: "Error",
        description: "No se pudo realizar la reserva.",
        variant: "destructive"
      });
    } finally {
      setShowConfirmDialog(false);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos en Bogotá</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Descubre y participa en los mejores eventos de la ciudad
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {user?.roles.includes('ORGANIZER') && (
          <div className="mb-10 flex justify-center">
            <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold animate-bounce">
              <Link href="/eventos/crear">Crear evento</Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} onAgendar={confirmAgendar} />
          ))}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar reserva</DialogTitle>
            <DialogDescription>
              ¿Deseas reservar un cupo para el evento <strong>{selectedEvento?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={realizarAgendamiento} className="bg-green-600 hover:bg-green-700 text-white">
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
              Has reservado exitosamente tu lugar en el evento <strong>{selectedEvento?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-primary text-white">
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
