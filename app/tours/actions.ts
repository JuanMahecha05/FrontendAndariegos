"use server";
import { cookies } from "next/headers";

const API_URL = "http://andariegos-api-gateway:8080/api";

export async function getToursAction() {
  try {
    const response = await fetch(`${API_URL}/tours`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener tours: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function getTourByIdAction(id: string) {
  try {
    const response = await fetch(`${API_URL}/tours/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener tour: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function createTourAction(tourData: {
  idUser: string;
  name: string;
  description: string;
  eventsIds: number[];
}) {
  console.log("[createTourAction] llamada con:", tourData);
  try {
    const response = await fetch(`${API_URL}/tours`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tourData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[createTourAction] error response:", errorText);
      return { success: false, error: errorText || "Error al crear tour" };
    }

    console.log("[createTourAction] éxito");
    return { success: true };
  } catch (err: any) {
    console.log("[createTourAction] catch error:", err);
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function updateTourAction(tourId: string, tourData: {
  idUser: string;
  name: string;
  description: string;
  eventsIds: number[];
}) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/tours/${tourId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tourData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al actualizar tour" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
}

export async function deleteTourAction(idTour: number) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const response = await fetch(`${API_URL}/tours/${idTour}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al eliminar tour" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
} 