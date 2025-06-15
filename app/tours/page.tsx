'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Star, Users, Calendar, MoreHorizontal, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { officialTours, userTours } from '@/data/tours'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/AuthContext'

const neonColors = ['neon-yellow', 'neon-blue', 'neon-red'];
function getRandomNeonColor(exclude: string): string {
  const filtered = neonColors.filter(c => c !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function ToursPage() {
  const [tours, setTours] = useState(officialTours);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('tours');
      if (local) {
        setTours(JSON.parse(local));
      }
    }
  }, []);

  const handleDeleteTour = (id: number) => {
    if (typeof window !== 'undefined') {
      const updatedTours = tours.filter(tour => tour.id !== id);
      localStorage.setItem('tours', JSON.stringify(updatedTours));
      setTours(updatedTours);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[300px] mb-16">
        <Image
          src="https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg"
          alt="Tours en Bogotá"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tours en Bogotá</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Explora la capital colombiana con nuestros tours guiados
            </p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4 space-y-16">
        {/* Tours Oficiales */}
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
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} isOfficial={true} onDelete={handleDeleteTour} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function TourCard({ tour, isOfficial, onDelete }: { tour: any; isOfficial: boolean; onDelete: (id: number) => void }) {
  const [neon, setNeon] = React.useState('neon-yellow');
  const [isHovered, setIsHovered] = React.useState(false);
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
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tour.title}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{tour.rating}</span>
          </div>
        </div>
        <CardDescription>{tour.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{tour.location}</span>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Eventos incluidos:</h4>
            <ul className="space-y-2">
              {tour.events?.map((event: any, index: number) => (
                <li key={index} className="text-sm text-gray-600">
                  • {event.title}
                </li>
              )) ?? <li className="text-sm text-gray-600">No hay eventos programados</li>}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
          }).format(tour.price)}
        </div>
        <div className="flex gap-2">
          {(!user || !user.roles.includes('ORGANIZER')) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Agendar Tour</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Reserva</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres agendar el tour <strong>{tour.title}</strong> por {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      maximumFractionDigits: 0
                    }).format(tour.price)}?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Link href={`/agendar-tour/${tour.id}`}>
                    <Button>Confirmar</Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Link href={`/tours/${tour.id}`}>
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
                  <Link href={`/editar-tour/${tour.id}`}>
                    Editar Tour
                  </Link>
                </DropdownMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem asChild>
                      <Button variant="ghost" className="w-full justify-start text-left font-normal text-red-600 hover:bg-red-50 focus:bg-red-50">
                        Eliminar
                      </Button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Eliminación</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar el tour <strong>{tour.title}</strong>? Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => onDelete(tour.id)}>Eliminar</Button>
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
