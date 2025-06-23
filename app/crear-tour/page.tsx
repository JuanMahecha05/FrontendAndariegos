import CrearTourForm from '@/components/CrearTourForm';
import { getAuthHeaders } from '@/lib/server-utils';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

async function getAvailableEvents() {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders as Record<string, string>),
      },
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Formato de eventos inválido");
    }

    return data.map((evento: any) => ({
      id: evento.id,
      nombre: evento.name,
      descripcion: evento.description,
      ubicacion: evento.address,
      duracion: evento.duration,
      precio: evento.price,
      imagen: evento.image1,
      horarios: evento.eventTimes?.map((et: any) => ({
        fecha: et.date || '2025-01-01', // fecha dummy si no hay
        inicio: et.availabilityPattern?.startTime || '08:00',
        fin: et.availabilityPattern?.endTime || '10:00',
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function CrearTourPage() {
  const availableEvents = await getAvailableEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Tour</h1>
      <CrearTourForm initialEvents={availableEvents} />
    </div>
  );
}
