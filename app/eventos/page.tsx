"use client";
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Star, Users, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from "next/navigation"

export default function EventosPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const eventos = [
    {
      id: 1,
      title: 'Visita Guiada al Museo del Oro',
      description: 'Explora la colección más grande de orfebrería prehispánica del mundo con un experto.',
      image: 'https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg',
      duration: '2 horas',
      location: 'Museo del Oro, La Candelaria',
      rating: 4.9,
      maxParticipants: 15,
      price: 35000,
      date: '2024-04-15',
      time: '10:00'
    },
    {
      id: 2,
      title: 'Recorrido Gastronómico Plaza de Paloquemao',
      description: 'Descubre los sabores y aromas de la gastronomía colombiana en el mercado más tradicional.',
      image: 'https://images.pexels.com/photos/2338015/pexels-photo-2338015.jpeg',
      duration: '3 horas',
      location: 'Plaza de Paloquemao',
      rating: 4.8,
      maxParticipants: 8,
      price: 45000,
      date: '2024-04-16',
      time: '09:00'
    },
    {
      id: 3,
      title: 'Taller de Arte Urbano',
      description: 'Aprende sobre el grafiti y el arte urbano mientras creas tu propia obra.',
      image: 'https://images.pexels.com/photos/14442358/pexels-photo-14442358.jpeg',
      duration: '2.5 horas',
      location: 'La Candelaria',
      rating: 4.7,
      maxParticipants: 10,
      price: 40000,
      date: '2024-04-17',
      time: '14:00'
    }
  ]

  const handleReservar = (eventoId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para reservar eventos",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1200); // 1.2 segundos para que vea el toast
      return;
    }
    
    // Obtener el evento seleccionado
    const eventoSeleccionado = eventos.find(e => e.id === eventoId);
    if (!eventoSeleccionado) return;

    // Obtener eventos reservados actuales del localStorage
    const eventosReservados = JSON.parse(localStorage.getItem('eventosReservados') || '[]');
    
    // Verificar si el evento ya está reservado
    if (eventosReservados.some((e: any) => e.id === eventoId)) {
      toast({
        title: "Evento ya reservado",
        description: "Ya tienes una reserva para este evento.",
        variant: "destructive"
      });
      return;
    }

    // Agregar el nuevo evento a la lista
    eventosReservados.push(eventoSeleccionado);
    
    // Guardar en localStorage
    localStorage.setItem('eventosReservados', JSON.stringify(eventosReservados));
    
    toast({
      title: "¡Reserva exitosa!",
      description: "Has reservado tu lugar en el evento.",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg"
          alt="Eventos en Bogotá"
          fill
          className="object-cover brightness-50"
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
        {/* Botón Crear evento solo para organizadores */}
        {user?.roles.includes('ORGANIZER') && (
          <div className="mb-10 flex justify-center">
            <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold animate-bounce">
              <Link href="/eventos/crear">Crear evento</Link>
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <Card key={evento.id} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative h-52 w-full">
                <Image
                  src={evento.image}
                  alt={evento.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{evento.title}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{evento.rating}</span>
                  </div>
                </div>
                <CardDescription>{evento.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{evento.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{evento.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{evento.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Máximo {evento.maxParticipants} participantes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => handleReservar(evento.id)}
                >
                  Crear Tour
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}