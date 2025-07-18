"use server";
import { cookies } from "next/headers";

const API_URL = process.env.INTERNAL_API_GATEWAY_URL!;

export async function getEventosAction() {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener eventos: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function getEventosWithAttendeesAction() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener eventos: ${response.status}`);
    }

    const data = await response.json();

    // Obtener inscritos para cada evento
    const eventosConInscritos = await Promise.all(
      data.map(async (evento: any) => {
        try {
          const resInscritos = await fetch(`${API_URL}/events/registration/attendees/${evento.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resInscritos.ok) {
            const inscritos = await resInscritos.json();
            return { ...evento, inscritos };
          }
        } catch (err) {
          console.error(`Error cargando inscritos para el evento ${evento.id}`);
        }
        return { ...evento, inscritos: [] };
      })
    );

    return { success: true, data: eventosConInscritos };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function getEventAttendeesAction(eventId: number) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/events/registration/attendees/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener asistentes: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function deleteEventAction(eventId: number) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al eliminar evento" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function updateEventAction(eventId: string, eventData: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al actualizar evento" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function registerEventoAction(eventId: string, userId: string, booking_date: string, booking_time: string) {
  try {
    const response = await fetch(`${API_URL}/events/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
        userId,
        booking_date,
        booking_time,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al registrar evento" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
} 

export async function getEventByIdAction(id: string) {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener evento: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
} 

export async function reportEventAction({
  id_event,
  id_reporter,
  description,
  state = "pending",
}: {
  id_event: number | string;
  id_reporter: string;
  description: string;
  state?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_event,
        id_reporter,
        description,
        state,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al crear el reporte" };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
} 