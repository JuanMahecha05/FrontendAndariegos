'use server'

import { cookies } from 'next/headers'
import { getAuthHeaders } from './server-utils'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'
import { decryptToken, isValidJWT } from './utils'
import { getCustomServerSession } from './server-utils'

const API_URL = "http://andariegos-api-gateway:8080/api";

export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  if (!identifier || !password) {
    throw new Error('Email y contraseña son requeridos')
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    const { access_token, user } = data

    // Procesar el token (desencriptar si es necesario)
    let processedToken = access_token;
    if (!isValidJWT(access_token)) {
      processedToken = decryptToken(access_token);
    }

    // Decodificar el token para obtener los roles
    const decodedToken = jwtDecode(processedToken)
    const roles = (decodedToken as any).roles || ['USER']

    // Transformar el usuario al formato esperado por el frontend
    const transformedUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      roles: roles,
      id: user._id
    }

    // Guardar el token en una cookie HTTP-only
    const cookieStore = cookies()
    cookieStore.set('access_token', processedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    // También guardar una cookie no HTTP-only para el cliente
    cookieStore.set('client_token', processedToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    // Retornar el token para que el cliente lo procese
    return { success: true, token: processedToken, user: transformedUser }
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión')
  }
}

export async function register(createUserInput: {
  name: string
  email: string
  username: string
  password: string
  roles: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RegisterUser($createUserInput: CreateUserInput!) {
            registerUser(createUserInput: $createUserInput) {
              email
              username
              name
              roles
              registrationDate
              state
            }
          }
        `,
        variables: {
          createUserInput,
        },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return data.data.registerUser
  } catch (error) {
    throw error
  }
}

// lib/actions.ts
export async function logoutServer() {
  const cookieStore = cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('client_token')
}

/**
 * Crea un nuevo tour en el sistema
 * 
 * @param formData - Datos del tour a crear
 * @param formData.title - Título del tour
 * @param formData.description - Descripción detallada del tour
 * @param formData.events - Array de eventos seleccionados para el tour
 *   - id: Identificador único del evento
 *   - nombre: Nombre del evento
 *   - descripcion: Descripción del evento
 *   - ubicacion: Lugar del evento
 *   - duracion: Duración en horas
 *   - precio: Costo del evento
 *   - imagen: URL de la imagen
 * 
 * 
 * @returns Objeto con el resultado de la operación
 *   - success: boolean - Indica si la operación fue exitosa
 *   - message: string - Mensaje descriptivo del resultado
 *   - tour: object (opcional) - Datos del tour creado
 *     - id: Identificador único del tour
 *     - title: Título del tour
 *     - description: Descripción del tour
 *     - events: Array de eventos asociados
 */
export async function createTour(formData: {
  title: string;
  description: string;
  events: Array<{
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    duracion: number;
    precio: number;
    imagen: string;
  }>;
}) {
  'use server'
  
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders || {}),
      } as HeadersInit,
      body: JSON.stringify({
        query: `
          mutation CreateTour($createTourInput: CreateTourInput!) {
            createTour(createTourInput: $createTourInput) {
              id
              title
              description
              events {
                id
                nombre
              }
            }
          }
        `,
        variables: {
          createTourInput: {
            title: formData.title,
            description: formData.description,
            eventIds: formData.events.map(event => event.id),
          },
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return { 
      success: true, 
      message: 'Tour creado exitosamente',
      tour: data.data.createTour 
    };
  } catch (error) {
    console.error('Error creating tour:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al crear el tour' 
    };
  }
}

/**
 * Actualiza un tour existente
 * 
 * TODO: Implementar cuando el backend esté disponible
 * 
 * La API necesitará:
 * 
 * 1. Endpoint: PUT /tours/{id}
 * 
 * 2. Headers requeridos:
 *    - Content-Type: application/json
 *    - Authorization: Bearer {token}
 * 
 * 3. Body de la petición:
 *    {
 *      "title": string,
 *      "description": string,
 *      "events": Array<{
 *        "id": string | number,
 *        "nombre": string,
 *        "descripcion": string,
 *        "ubicacion": string,
 *        "duracion": number,
 *        "precio": number,
 *        "imagen": string
 *      }>
 *    }
 * 
 * 4. Respuesta esperada:
 *    {
 *      "success": boolean,
 *      "message": string,
 *      "tour": {
 *        "id": string,
 *        "title": string,
 *        "description": string,
 *        "events": Array<{
 *          "id": string | number,
 *          "nombre": string
 *        }>
 *      }
 *    }
 */
export async function updateTour(tourId: string, formData: {
  title: string;
  description: string;
  events: Array<{
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    duracion: number;
    precio: number;
    imagen: string;
  }>;
}) {
  'use server'
  
  try {
    // Simulamos una pequeña demora para que parezca que estamos procesando
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Por ahora, siempre devolvemos éxito
    return { 
      success: true, 
      message: 'Tour actualizado exitosamente',
      tour: {
        id: tourId,
        ...formData
      }
    };
  } catch (error) {
    console.error('Error updating tour:', error);
    return { 
      success: false, 
      message: 'Error al actualizar el tour'
    };
  }
} 

/**Add commentMore actions
 * Obtiene un tour específico por ID
 * 
 * @param tourId - ID del tour a obtener
 * @returns Objeto con el resultado de la operación
 *   - success: boolean - Indica si la operación fue exitosa
 *   - message: string - Mensaje descriptivo del resultado
 *   - tour: object (opcional) - Datos del tour
 */
export async function getTourById(tourId: string) {
  'use server'
  
  try {
    const session = await getCustomServerSession();
    if (!session) {
      return { 
        success: false, 
        message: 'No tienes permisos para ver tours'
      };
    }

    console.log(`Fetching tour with ID: ${tourId}`);
    
    const response = await fetch(`${API_URL}/api/tours/${tourId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error fetching tour ${tourId}:`, errorData);
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Tour data received:`, data);

    // Transformar los datos al formato esperado por el frontend
    const transformedTour = {
      id: data.idTour?.toString() || tourId,
      title: data.name || data.title || '',
      description: data.description || '',
      events: data.events || data.eventIds || []
    };

    console.log(`Transformed tour:`, transformedTour);

    return { 
      success: true, 
      message: 'Tour obtenido exitosamente',
      tour: transformedTour
    };
  } catch (error) {
    console.error('Error getting tour:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al obtener el tour'
    };
  }
}

export async function getAvailableEvents() {
  'use server'
  
  try {
    const session = await getCustomServerSession();
    if (!session) {
      return { 
        success: false, 
        message: 'No tienes permisos para ver eventos'
      };
    }

    console.log('Fetching available events...');
    
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching events:', errorData);
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Events data received:`, data);

    return { 
      success: true, 
      message: 'Eventos obtenidos exitosamente',
      events: data || []
    };
  } catch (error) {
    console.error('Error getting events:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al obtener los eventos',
      events: []
    };
  }
}