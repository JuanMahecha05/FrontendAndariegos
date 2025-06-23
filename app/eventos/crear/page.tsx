"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const MALICIOUS_DOMAINS = ["porn", "sex", "xxx", "redtube", "xvideos", "xnxx", "hentai", "youporn", "brazzers", "camgirl", "cam4", "chaturbate", "xhamster", "spankbang", "tnaflix", "fapdu", "erotic", "escort", "bet365", "casino", "phishing", "malware", "virus"];

function isSafeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return !MALICIOUS_DOMAINS.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
}

export default function CrearEventoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    image1: "",
    image2: "",
    image3: "",
    description: "",
    price: "",
    date: "",
    days: [] as { day: string; startTime: string; endTime: string }[],
    city: "",
    address: "",
    availableSpots: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const toggleDay = (day: string) => {
    setForm(prev => {
      const exists = prev.days.find(d => d.day === day);
      const updated = exists
        ? prev.days.filter(d => d.day !== day)
        : [...prev.days, { day, startTime: "", endTime: "" }];
      return { ...prev, days: updated };
    });
  };

  const updateDayTime = (day: string, field: "startTime" | "endTime", value: string) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map(d => d.day === day ? { ...d, [field]: value } : d)
    }));
  };

  const convertToTimeSlots = () => {
    const dayMap: Record<string, number> = {
      Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5,
      Sábado: 6, Domingo: 7
    };
    const slots: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
    form.days.forEach(d => {
      const dayNum = dayMap[d.day];
      if (d.startTime && d.endTime) {
        slots.push({ dayOfWeek: dayNum, startTime: d.startTime, endTime: d.endTime });
      }
    });
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price || (!form.date && form.days.length === 0) || !form.city || !form.address) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const imageUrls = [form.image1, form.image2, form.image3].filter(Boolean);
    for (const url of imageUrls) {
      if (!isSafeUrl(url)) {
        setError("Una de las URL de imagen no es válida o proviene de un sitio no permitido.");
        return;
      }
    }

    const payload = {
      name: form.name,
      image1: form.image1,
      image2: form.image2,
      image3: form.image3,
      description: form.description,
      price: Number(form.price),
      date: form.date || null,
      days: [],
      city: form.city,
      address: form.address,
      availableSpots: form.availableSpots ? Number(form.availableSpots) : null,
      timeSlots: convertToTimeSlots(),
    };

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Detalles del error:", errorText);
        throw new Error(errorText || "Error al crear el evento");
      }

      toast({
        title: "¡Evento creado exitosamente!",
        description: "El evento ha sido guardado en la base de datos.",
      });

      setTimeout(() => router.push("/eventos"), 1500);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Hubo un problema al guardar el evento.",
        variant: "destructive",
      });
      console.error("Error:", err);
    }
  };

  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-32 pb-16">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Crear nuevo evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-primary">Título *</label>
              <Input name="name" value={form.name} onChange={handleChange} required maxLength={80} placeholder="Nombre del evento" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL de imagen 1</label>
              <Input name="image1" value={form.image1} onChange={handleChange} placeholder="https://..." type="url" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL de imagen 2</label>
              <Input name="image2" value={form.image2} onChange={handleChange} placeholder="https://..." type="url" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">URL de imagen 3</label>
              <Input name="image3" value={form.image3} onChange={handleChange} placeholder="https://..." type="url" />
              <span className="text-xs text-muted-foreground">Solo se permiten URLs de sitios seguros.</span>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Descripción *</label>
              <Textarea name="description" value={form.description} onChange={handleChange} required minLength={10} maxLength={500} placeholder="Describe el evento..." />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Precio (COP) *</label>
                <Input name="price" value={form.price} onChange={handleChange} required type="number" min={0} placeholder="Ej: 50000" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Aforo (opcional)</label>
                <Input name="availableSpots" value={form.availableSpots} onChange={handleChange} type="number" min={0} placeholder="Ej: 30" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Ciudad *</label>
                <Input name="city" value={form.city} onChange={handleChange} required placeholder="Ej: Bogotá" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">Dirección *</label>
                <Input name="address" value={form.address} onChange={handleChange} required placeholder="Ej: Calle 123 #45-67" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">Fecha específica</label>
              <Input name="date" value={form.date} onChange={handleChange} type="date" />
              <span className="text-xs text-muted-foreground">O selecciona días de la semana:</span>
              <div className="mt-2">
                {weekDays.map((day) => {
                  const selectedDay = form.days.find(d => d.day === day);
                  return (
                    <div key={day} className="flex flex-col mb-4">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={!!selectedDay}
                          onChange={() => toggleDay(day)}
                        />
                        {day}
                      </label>
                      {selectedDay && (
                        <div className="ml-6 mt-2 flex gap-4">
                          <label className="flex flex-col text-sm">
                            Hora inicio:
                            <input
                              type="time"
                              value={selectedDay.startTime}
                              onChange={(e) => updateDayTime(day, "startTime", e.target.value)}
                              required
                            />
                          </label>
                          <label className="flex flex-col text-sm">
                            Hora fin:
                            <input
                              type="time"
                              value={selectedDay.endTime}
                              onChange={(e) => updateDayTime(day, "endTime", e.target.value)}
                              required
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            <Button type="submit" size="lg" className="w-full">
              Crear evento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
