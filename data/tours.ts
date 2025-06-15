// data/tours.ts

// 1. Definición de tipos
export interface TourEvent {
  title: string
  time: string
  description: string
  image?: string
  location: string
}

export interface BaseTour {
  id: number
  title: string
  description: string
  image: string
  duration: string
  location: string
  rating: number
  price: number
  events: TourEvent[]
}

export interface OfficialTour extends BaseTour {}

export interface UserTour extends BaseTour {
  creator: string
  creatorRating: number
}

// 2. Tours oficiales
export const officialTours: OfficialTour[] = [
  {
    id: 1,
    title: 'Candelaria Histórica',
    description: 'Recorre el corazón histórico de Bogotá, visitando museos, iglesias coloniales y plazas emblemáticas.',
    image: 'https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg',
    duration: '3 horas',
    location: 'La Candelaria',
    rating: 4.9,
    price: 60000,
    events: [
      {
        title: 'Visita al Museo Botero',
        time: '10:00 - 11:30',
        description: 'Recorrido por la colección de arte del maestro Fernando Botero',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'La Candelaria'
      },
      {
        title: 'Tour por la Plaza de Bolívar',
        time: '11:45 - 12:45',
        description: 'Conoce la historia y arquitectura de la plaza principal de Bogotá',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'La Candelaria'
      },
      {
        title: 'Visita a la Catedral Primada',
        time: '13:00 - 14:00',
        description: 'Explora la catedral más importante de Colombia',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'La Candelaria'
      }
    ]
  },
  {
    id: 2,
    title: 'Grafiti Tour',
    description: 'Descubre el arte urbano que ha convertido a Bogotá en una referencia mundial del grafiti y el street art.',
    image: 'https://images.pexels.com/photos/14442358/pexels-photo-14442358.jpeg',
    duration: '2.5 horas',
    location: 'Centro y Chapinero',
    rating: 4.8,
    price: 55000,
    events: [
      {
        title: 'Taller de Grafiti',
        time: '14:00 - 15:30',
        description: 'Aprende las técnicas básicas del arte urbano',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Centro y Chapinero'
      },
      {
        title: 'Recorrido por Murales',
        time: '15:45 - 17:00',
        description: 'Visita los murales más emblemáticos de la ciudad',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Centro y Chapinero'
      }
    ]
  },
  {
    id: 3,
    title: 'Sabores Bogotanos',
    description: 'Prueba los mejores platos típicos de la capital colombiana en un recorrido gastronómico único.',
    image: 'https://images.pexels.com/photos/2338015/pexels-photo-2338015.jpeg',
    duration: '4 horas',
    location: 'Paloquemao y Centro',
    rating: 4.9,
    price: 85000,
    events: [
      {
        title: 'Mercado de Paloquemao',
        time: '09:00 - 10:30',
        description: 'Recorrido por el mercado más tradicional de Bogotá',
        image: 'https://images.pexels.com/photos/13447155/pexels-photo-13447155.jpeg',
        location: 'Paloquemao y Centro'
      },
      {
        title: 'Degustación de Frutas',
        time: '10:45 - 11:45',
        description: 'Prueba las frutas exóticas de Colombia',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Paloquemao y Centro'
      },
      {
        title: 'Almuerzo Típico',
        time: '12:00 - 13:30',
        description: 'Disfruta de los platos más representativos de la gastronomía bogotana',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Paloquemao y Centro'
      }
    ]
  }
]

// 3. Tours de usuarios
export const userTours: UserTour[] = [
  {
    id: 4,
    title: 'Monserrate y Centro',
    description: 'Sube al cerro de Monserrate y disfruta de las mejores vistas de la ciudad mientras conoces su historia.',
    image: 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg',
    duration: '5 horas',
    location: 'Monserrate y Centro',
    rating: 4.9,
    price: 95000,
    creator: 'Juan Pérez',
    creatorRating: 4.8,
    events: [
      {
        title: 'Subida a Monserrate',
        time: '09:00 - 11:00',
        description: 'Ascenso al cerro más emblemático de Bogotá',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Monserrate y Centro'
      },
      {
        title: 'Visita al Santuario',
        time: '11:15 - 12:15',
        description: 'Conoce la historia y arquitectura del santuario',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Monserrate y Centro'
      }
    ]
  },
  {
    id: 5,
    title: 'Tour Nocturno',
    description: 'Explora la vida nocturna de Bogotá, sus bares tradicionales y la cultura local.',
    image: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg',
    duration: '4 horas',
    location: 'Zona G y Chapinero',
    rating: 4.7,
    price: 75000,
    creator: 'María Rodríguez',
    creatorRating: 4.9,
    events: [
      {
        title: 'Recorrido por Bares',
        time: '20:00 - 23:00',
        description: 'Visita los bares más emblemáticos de la zona',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Zona G y Chapinero'
      }
    ]
  },
  {
    id: 6,
    title: 'Naturaleza y Aventura',
    description: 'Visita los parques naturales cercanos a Bogotá y disfruta de actividades al aire libre.',
    image: 'https://images.pexels.com/photos/6580703/pexels-photo-6580703.jpeg',
    duration: '8 horas',
    location: 'Alrededores de Bogotá',
    rating: 4.8,
    price: 120000,
    creator: 'Carlos Gómez',
    creatorRating: 4.7,
    events: [
      {
        title: 'Senderismo',
        time: '08:00 - 12:00',
        description: 'Recorrido por senderos naturales',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Alrededores de Bogotá'
      },
      {
        title: 'Almuerzo Campestre',
        time: '12:30 - 14:00',
        description: 'Disfruta de un almuerzo en la naturaleza',
        image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
        location: 'Alrededores de Bogotá'
      }
    ]
  }
]

// 4. Todos los tours juntos (opcional)
export const allTours = [...officialTours, ...userTours]
