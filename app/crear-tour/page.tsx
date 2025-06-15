import CrearTourForm from '@/components/CrearTourForm';
import { getAuthHeaders } from '@/lib/server-utils';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

/**
 * Obtiene los eventos disponibles para crear un tour
 * 
 * La consulta GraphQL necesita los siguientes campos:
 * - id: Identificador único del evento
 * - nombre: Nombre del evento
 * - descripcion: Descripción detallada del evento
 * - ubicacion: Lugar donde se realiza el evento
 * - duracion: Duración en horas del evento
 * - precio: Costo del evento
 * - imagen: URL de la imagen del evento
 * - horarios: Array de horarios disponibles
 *   - fecha: Fecha del horario (YYYY-MM-DD)
 *   - inicio: Hora de inicio (HH:mm) (se obtiene del primer evento en la secuencia)
 *   - fin: Hora de finalización (HH:mm) (se obtiene del último evento en la secuencia)
 */
async function getAvailableEvents() {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({
        query: `
          query GetAvailableEvents {
            events {
              id
              nombre
              descripcion
              ubicacion
              duracion
              precio
              imagen
              horarios {
                fecha
                inicio
                fin
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data.events;
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