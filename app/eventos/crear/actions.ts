"use server";
import { cookies } from "next/headers";

const API_URL = process.env.INTERNAL_API_GATEWAY_URL!;

export async function createEventAction(formData: {
  name: string;
  image1: string;
  image2: string;
  image3: string;
  description: string;
  price: number;
  date: string | null;
  city: string;
  address: string;
  availableSpots: number | null;
  timeSlots: { dayOfWeek: number; startTime: string; endTime: string }[];
}) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("client_token")?.value;
    if (!token) {
      return { success: false, error: "No autenticado" };
    }

    const payload = {
      ...formData,
    };

    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Error al crear el evento" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error inesperado" };
  }
} 