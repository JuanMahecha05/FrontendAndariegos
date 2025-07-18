"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/AuthContext";
import { getEventByIdAction, updateEventAction } from "@/app/eventos/actions";

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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
  const { user } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const result = await getEventByIdAction(id as string);
        if (!result.success) {
          throw new Error(result.error || "Evento no encontrado");
        }

        const data = result.data;
        const daysMap: { [key: number]: string } = Object.fromEntries(
          Object.entries(dayMap).map(([k, v]) => [v, k])
        );

        const groupedDays: Record<string, { startTime: string; endTime: string }[]> = {};
        data.eventTimes?.forEach((et: any) => {
          const dayName = daysMap[et.availabilityPattern.dayOfWeek];
          const start = et.availabilityPattern.startTime.slice(0, 5);
          const end = et.availabilityPattern.endTime.slice(0, 5);
          if (!groupedDays[dayName]) groupedDays[dayName] = [];
          groupedDays[dayName].push({ startTime: start, endTime: end });
        });

        const transformedForm = {
          ...data,
          price: data.price.toString(),
          availableSpots: data.availableSpots?.toString() || "",
          date: data.date || "",
          days: Object.entries(groupedDays).map(([day, times]) => ({ day, times })),
          image1: data.image1 || "",
          image2: data.image2 || "",
          image3: data.image3 || ""
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

  const handleTimeChange = (day: string, index: number, field: "startTime" | "endTime", value: string) => {
    const updatedDays = form.days.map((d: any) => {
      if (d.day === day) {
        const updatedTimes = d.times.map((t: any, i: number) =>
          i === index ? { ...t, [field]: value } : t
        );
        return { ...d, times: updatedTimes };
      }
      return d;
    });
    setForm({ ...form, days: updatedDays });
  };

  const addTimeRange = (day: string) => {
    const updatedDays = form.days.map((d: any) =>
      d.day === day ? { ...d, times: [...d.times, { startTime: "", endTime: "" }] } : d
    );
    setForm({ ...form, days: updatedDays });
  };

  const toggleDay = (day: string) => {
    const exists = form.days?.find((d: any) => d.day === day);
    const updatedDays = exists
      ? form.days.filter((d: any) => d.day !== day)
      : [...(form.days || []), { day, times: [{ startTime: "", endTime: "" }] }];
    setForm({ ...form, days: updatedDays });
  };

  const convertToTimeSlots = () => {
    const timeSlots: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
    form.days.forEach((d: any) => {
      const dayNum = dayMap[d.day];
      d.times.forEach((range: any) => {
        timeSlots.push({ dayOfWeek: dayNum, startTime: range.startTime, endTime: range.endTime });
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
      description: form.description,
      city: form.city,
      address: form.address,
      price: Number(form.price),
      image1: form.image1,
      image2: form.image2,
      image3: form.image3,
      timeSlots: convertToTimeSlots(),
    };

    try {
      const result = await updateEventAction(id as string, payload);
      if (result.success) {
        toast({
          title: "Evento actualizado",
          description: "Los cambios se guardaron correctamente.",
        });

        setTimeout(() => router.push("/eventos-admin"), 1500);
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo actualizar el evento.",
          variant: "destructive",
        });
      }
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
              <label className="block font-medium mb-1 text-primary">URL Imagen 1</label>
              <Input name="image1" value={form.image1} onChange={handleChange} type="url" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL Imagen 2</label>
              <Input name="image2" value={form.image2} onChange={handleChange} type="url" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL Imagen 3</label>
              <Input name="image3" value={form.image3} onChange={handleChange} type="url" />
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
              <div className="mt-2 space-y-4">
                {weekDays.map((day) => {
                  const selectedDay = form.days?.find((d: any) => d.day === day);
                  return (
                    <div key={day} className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={!!selectedDay}
                          onChange={() => toggleDay(day)}
                        />
                        {day}
                      </label>
                      {selectedDay && (
                        <div className="ml-6 space-y-2">
                          {selectedDay.times.map((range: any, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                type="time"
                                value={range.startTime}
                                onChange={(e) => handleTimeChange(day, idx, "startTime", e.target.value)}
                              />
                              <Input
                                type="time"
                                value={range.endTime}
                                onChange={(e) => handleTimeChange(day, idx, "endTime", e.target.value)}
                              />
                            </div>
                          ))}
                          <Button type="button" onClick={() => addTimeRange(day)} size="sm">
                            + Añadir rango
                          </Button>
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