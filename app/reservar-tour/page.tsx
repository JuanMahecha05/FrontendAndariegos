"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/AuthContext';

const posiblesGuias = [
  { id: 1, nombre: 'Guía Juan', experiencia: '5 años', especialidad: 'Cultural' },
  { id: 2, nombre: 'Guía María', experiencia: '3 años', especialidad: 'Gastronómico' },
  { id: 3, nombre: 'Guía Carlos', experiencia: '7 años', especialidad: 'Naturaleza' },
];

export default function ReservarTourPage() {
  const { user, isAuthenticated } = useAuth();
  const [tour, setTour] = useState<any>(null);
  const [guiaPorEvento, setGuiaPorEvento] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    const data = localStorage.getItem('tourAReservar');
    if (data) setTour(JSON.parse(data));
  }, [isAuthenticated]);

  if (!tour) return <div className="container mx-auto mt-24">Cargando...</div>;

  const handleGuiaChange = (eventoIdx: number, guiaId: string) => {
    setGuiaPorEvento((prev: any) => ({ ...prev, [eventoIdx]: guiaId }));
  };

  const handleConfirmar = () => {
    // Aquí podrías enviar la reserva al backend
    alert('¡Reserva confirmada!');
    // Opcional: limpiar localStorage
    localStorage.removeItem('tourAReservar');
  };

  return (
    <div className="container mx-auto py-10 mt-28">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Reservar Tour: {tour.title}</CardTitle>
          <CardDescription>{tour.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Resumen del Tour</h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Duración total: {tour.totalDuration} horas</li>
              <li>Precio total: ${tour.totalPrice}</li>
              <li>Categorías: {tour.categories?.join(', ')}</li>
              <li>Ubicación inicial: {tour.eventSequence?.[0]?.ubicacion}</li>
              <li>Ubicación final: {tour.eventSequence?.[tour.eventSequence.length-1]?.ubicacion}</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="font-semibold text-lg mb-2">Elige un guía para cada evento (opcional)</h3>
            {tour.eventSequence?.map((evento: any, idx: number) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="font-medium mb-1">{evento.nombre}</div>
                <div className="flex gap-4 items-center">
                  <select
                    className="border rounded-md px-3 py-2"
                    value={guiaPorEvento[idx] || ''}
                    onChange={e => handleGuiaChange(idx, e.target.value)}
                  >
                    <option value="">Sin guía</option>
                    {posiblesGuias.map(guia => (
                      <option key={guia.id} value={guia.nombre}>
                        {guia.nombre} ({guia.especialidad}, {guia.experiencia})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg font-semibold" onClick={handleConfirmar}>
            Confirmar Reserva
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 