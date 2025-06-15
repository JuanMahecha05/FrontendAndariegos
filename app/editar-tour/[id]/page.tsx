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

// Datos de ejemplo para pruebas
const mockTour = {
  id: "1",
  title: "Tour por el Centro Histórico",
  description: "Un recorrido fascinante por los lugares más emblemáticos del centro histórico de la ciudad.",
  events: [
    {
      id: 1,
      nombre: "Plaza Mayor",
      descripcion: "La plaza principal de la ciudad",
      ubicacion: "Centro Histórico",
      duracion: 2,
      precio: 15,
      imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000",
      horarios: []
    },
    {
      id: 2,
      nombre: "Catedral",
      descripcion: "La catedral más antigua de la ciudad",
      ubicacion: "Centro Histórico",
      duracion: 1,
      precio: 10,
      imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000",
      horarios: []
    }
  ]
};

const mockAvailableEvents = [
  {
    id: 1,
    nombre: "Plaza Mayor",
    descripcion: "La plaza principal de la ciudad",
    ubicacion: "Centro Histórico",
    duracion: 2,
    precio: 15,
    imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000",
    horarios: []
  },
  {
    id: 2,
    nombre: "Catedral",
    descripcion: "La catedral más antigua de la ciudad",
    ubicacion: "Centro Histórico",
    duracion: 1,
    precio: 10,
    imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000",
    horarios: []
  },
  {
    id: 3,
    nombre: "Museo de Arte",
    descripcion: "Museo con obras de arte contemporáneo",
    ubicacion: "Centro Cultural",
    duracion: 3,
    precio: 20,
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    horarios: []
  }
];

export default async function EditarTourPage({ params }: { params: { id: string } }) {
  // Simulamos una pequeña demora para que parezca que estamos cargando datos
  await new Promise(resolve => setTimeout(resolve, 500));

  // Por ahora, siempre devolvemos el tour de ejemplo
  const tour = mockTour;
  const availableEvents = mockAvailableEvents;

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6">Tour no encontrado</h1>
        <p>El tour que buscas no existe o no tienes permisos para verlo.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <EditarTourForm 
        tour={tour} 
        availableEvents={availableEvents} 
      />
    </div>
  );
} 