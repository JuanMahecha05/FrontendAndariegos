"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const hourRanges = ["6:00-9:00", "12:00-14:00", "14:00-17:00", "17:00-20:00"];

export default function EditarEventoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
    const evento = eventos.find((e: any, index: number) => index + 1 === parseInt(id as string));
    if (evento) {
      setForm({ ...evento });
    } else {
      setError("Evento no encontrado");
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.description || !form.price || !form.city || !form.address) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
    const updated = eventos.map((ev: any, index: number) =>
      index + 1 === parseInt(id as string) ? form : ev
    );
    localStorage.setItem("eventos", JSON.stringify(updated));
    setSuccess("¡Evento actualizado exitosamente!");
    setTimeout(() => router.push("/eventos-admin"), 1500);
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
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={80}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL de imagen</label>
              <Input
                name="image1"
                value={form.image1}
                onChange={handleChange}
                type="url"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Descripción *</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Precio *</label>
                <Input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  type="number"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Aforo</label>
                <Input
                  name="availableSpots"
                  value={form.availableSpots}
                  onChange={handleChange}
                  type="number"
                  min={0}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Ciudad *</label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Dirección *</label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Fecha</label>
              <Input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
              />
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
            {success && <div className="text-green-600 text-sm font-medium">{success}</div>}
            <Button type="submit" size="lg" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
