"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/AuthContext";

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const hourRanges = ["6:00-9:00", "12:00-14:00", "14:00-17:00", "17:00-20:00"];
const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const dayMap: Record<string, number> = {
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
  "Domingo": 7
};

export default function EditarEventoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${id}`);
        if (!response.ok) throw new Error("Evento no encontrado");
        const data = await response.json();

        const daysMap: { [key: number]: string } = Object.fromEntries(
          Object.entries(dayMap).map(([k, v]) => [v, k])
        );

        const groupedDays: Record<string, string[]> = {};
        data.eventTimes?.forEach((et: any) => {
          const dayName = daysMap[et.availabilityPattern.dayOfWeek];
          const timeRange = `${et.availabilityPattern.startTime.slice(0, 5)}-${et.availabilityPattern.endTime.slice(0, 5)}`;
          if (!groupedDays[dayName]) groupedDays[dayName] = [];
          groupedDays[dayName].push(timeRange);
        });

        const transformedForm = {
          ...data,
          price: data.price.toString(),
          availableSpots: data.availableSpots?.toString() || "",
          date: data.date || "",
          days: Object.entries(groupedDays).map(([day, times]) => ({ day, times }))
        };

        setForm(transformedForm);
      } catch (err) {
        setError("No se pudo cargar el evento.");
        console.error(err);
      }
    };

    fetchEvento();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const toggleDay = (day: string) => {
    const exists = form.days?.find((d: any) => d.day === day);
    const updatedDays = exists
      ? form.days.filter((d: any) => d.day !== day)
      : [...(form.days || []), { day, times: [] }];
    setForm({ ...form, days: updatedDays });
  };

  const toggleHourRange = (day: string, time: string) => {
    const updatedDays = form.days.map((d: any) =>
      d.day === day
        ? {
            ...d,
            times: d.times.includes(time)
              ? d.times.filter((t: string) => t !== time)
              : [...d.times, time],
          }
        : d
    );
    setForm({ ...form, days: updatedDays });
  };

  const convertToTimeSlots = () => {
    const timeSlots: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
    form.days.forEach((d: any) => {
      const dayNum = dayMap[d.day];
      d.times.forEach((range: string) => {
        const [startTime, endTime] = range.split("-");
        timeSlots.push({ dayOfWeek: dayNum, startTime, endTime });
      });
    });
    return timeSlots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price || !form.city || !form.address) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      name: form.name,
      image1: form.image1,
      description: form.description,
      price: Number(form.price),
      date: form.date || null,
      city: form.city,
      address: form.address,
      availableSpots: form.availableSpots ? Number(form.availableSpots) : null,
      timeSlots: convertToTimeSlots(),
    };

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al actualizar el evento");

      toast({
        title: "Evento actualizado",
        description: "Los cambios se guardaron correctamente.",
      });

      setTimeout(() => router.push("/eventos-admin"), 1500);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el evento.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-lg text-muted-foreground">Cargando evento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-16">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Editar evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-primary">Título *</label>
              <Input name="name" value={form.name} onChange={handleChange} required maxLength={80} />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL de imagen</label>
              <Input name="image1" value={form.image1} onChange={handleChange} type="url" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Descripción *</label>
              <Textarea name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Precio *</label>
                <Input name="price" value={form.price} onChange={handleChange} required type="number" min={0} />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Aforo</label>
                <Input name="availableSpots" value={form.availableSpots} onChange={handleChange} type="number" min={0} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Ciudad *</label>
                <Input name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Dirección *</label>
                <Input name="address" value={form.address} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Fecha</label>
              <Input name="date" value={form.date} onChange={handleChange} type="date" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Días y horarios</label>
              <div className="mt-2">
                {weekDays.map((day) => {
                  const selectedDay = form.days?.find((d: any) => d.day === day);
                  return (
                    <div key={day} className="flex flex-col mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={!!selectedDay}
                          onChange={() => toggleDay(day)}
                        />
                        {day}
                      </label>
                      {selectedDay && (
                        <div className="ml-6 mt-1 flex flex-wrap gap-2 text-xs">
                          {hourRanges.map((range) => (
                            <label key={range} className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={selectedDay.times.includes(range)}
                                onChange={() => toggleHourRange(day, range)}
                              />
                              {range}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            <Button type="submit" size="lg" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
