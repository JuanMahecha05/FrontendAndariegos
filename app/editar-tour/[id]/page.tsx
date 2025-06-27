import { Metadata } from 'next';
import EditarTourForm from '@/components/EditarTourForm';

/**
 * TODO: Implementar cuando el backend esté disponible
 * 
 * La API necesitará proporcionar:
 * 
 * 1. Datos del Tour (GET /tours/{id}):
 *    - id: string - Identificador único del tour
 *    - title: string - Título del tour
 *    - description: string - Descripción detallada del tour
 *    - events: Array<Evento> - Lista de eventos en el tour
 *      - id: string | number - ID del evento
 *      - nombre: string - Nombre del evento
 *      - descripcion: string - Descripción del evento
 *      - ubicacion: string - Lugar donde se realiza
 *      - duracion: number - Duración en horas
 *      - precio: number - Costo del evento
 *      - imagen: string - URL de la imagen
 *      - horarios: Array<Horario> - Horarios disponibles
 *        - fecha: string - Fecha (YYYY-MM-DD)
 *        - inicio: string - Hora de inicio (HH:mm)
 *        - fin: string - Hora de fin (HH:mm)
 * 
 * 2. Eventos Disponibles (GET /events):
 *    - Array de todos los eventos disponibles con la misma estructura
 *    - Debe incluir eventos que ya están en el tour y otros disponibles
 *    - Debe incluir los horarios disponibles para cada evento
 * 
 * 3. Actualización del Tour (PUT /tours/{id}):
 *    - Debe aceptar:
 *      - title: string
 *      - description: string
 *      - events: Array<{id: string | number}> - IDs de los eventos en el orden deseado
 */

export const dynamic = 'force-dynamic';

// @ts-ignore Next.js type generation bug: expects Promise in params, but should be plain object
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Editar Tour ${params.id}`,
    description: 'Edita los detalles de tu tour personalizado',
  };
}

// @ts-ignore Next.js type generation bug: expects Promise in params, but should be plain object
export default function EditarTourPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <EditarTourForm tourId={params.id} />
    </div>
  );
} 