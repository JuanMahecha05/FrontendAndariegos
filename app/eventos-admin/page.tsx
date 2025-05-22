"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Star, Users, Calendar, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Evento {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  location: string;
  rating: number;
  maxParticipants: number;
  price: number;
  date: string;
  time: string;
  status: string;
  inscritos?: {
    id: number;
    name: string;
    email: string;
  }[];
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
      router.push('/login');
      return;
    }

    if (!user?.roles.includes('ORGANIZER')) {
      router.push('/');
      return;
    }

    // Cargar todos los eventos
    const todosLosEventos: Evento[] = [
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
        time: '10:00',
        status: 'active',
        inscritos: [
          { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
          { id: 2, name: 'María García', email: 'maria@example.com' }
        ]
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
        time: '09:00',
        status: 'active',
        inscritos: [
          { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com' }
        ]
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
        time: '14:00',
        status: 'active',
        inscritos: []
      }
    ];
    setEventos(todosLosEventos);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleEdit = (eventId: number) => {
    router.push(`/eventos/editar/${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        // Aquí iría la llamada a la API para eliminar el evento
        setEventos(eventos.filter(evento => evento.id !== eventId));
        toast({
          title: 'Evento eliminado',
          description: 'El evento ha sido eliminado exitosamente.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el evento.',
          variant: 'destructive',
        });
      }
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

  if (!user || !user.roles.includes('ORGANIZER')) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600 mb-4">Solo los organizadores pueden acceder a esta página.</p>
          <Button onClick={() => router.push('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg"
          alt="Administración de Eventos"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Administración de Eventos</h1>
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
                    src={evento.image}
                    alt={evento.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{evento.title}</CardTitle>
                        <CardDescription className="mt-2">{evento.description}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{evento.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{evento.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{evento.time}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{evento.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{evento.inscritos?.length || 0} / {evento.maxParticipants} participantes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => toggleExpandirEvento(evento.id)}
                      className="flex items-center"
                    >
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
              
              {/* Sección de inscritos */}
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