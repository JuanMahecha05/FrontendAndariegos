'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Clock, MapPin, Star, MoreHorizontal
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const neonColors = ['neon-yellow', 'neon-blue', 'neon-red'];
function getRandomNeonColor(exclude: string): string {
  const filtered = neonColors.filter(c => c !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tours`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("No se pudieron cargar los tours");
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error("Error cargando tours:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTours();
    }
  }, [token]);

  const handleDeleteTour = async (idTour: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tours/${idTour}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error al eliminar tour");

      setTours(prev => prev.filter(tour => tour.idTour !== idTour));
    } catch (error) {
      console.error("Error eliminando tour:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 text-center">
        <p className="text-muted-foreground text-lg">Cargando tours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 space-y-16">
        {user?.roles.includes('ORGANIZER') && (
          <div className="mb-10 flex justify-center">
            <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold animate-bounce">
              <Link href="/crear-tour">Crear Tour</Link>
            </Button>
          </div>
        )}

        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary dark:text-white">Tours</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
              <TourCard key={tour.idTour} tour={tour} onDelete={handleDeleteTour} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TourCard({ tour, onDelete }: { tour: any; onDelete: (id: number) => void }) {
  const [neon, setNeon] = useState('neon-yellow');
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

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
          src={tour.events[0]?.image || "https://via.placeholder.com/400x300"}
          alt={tour.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tour.name}</CardTitle>
        </div>
        <CardDescription>{tour.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Eventos incluidos:</h4>
            <ul className="space-y-2">
              {tour.events.length > 0 ? (
                tour.events.map((event: any, index: number) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {event.nameEvent}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-600">No hay eventos programados</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          {tour.events.length > 0
            ? new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
              }).format(tour.events.reduce((sum: number, ev: any) => sum + ev.price, 0))
            : "—"}
        </div>
        <div className="flex gap-2">
          <Link href={`/tours/${tour.idTour}`}>
            <Button variant="outline">Ver detalles</Button>
          </Link>
          {user?.roles.includes('ORGANIZER') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Administrar Tour</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/editar-tour/${tour.idTour}`}>
                    Editar Tour
                  </Link>
                </DropdownMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left font-normal text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Eliminación</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar el tour <strong>{tour.name}</strong>?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => onDelete(tour.idTour)}>Eliminar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
