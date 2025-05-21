"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import api from "@/lib/api";

const MALICIOUS_DOMAINS = [
  "porn",
  "sex",
  "xxx",
  "redtube",
  "xvideos",
  "xnxx",
  "hentai",
  "youporn",
  "brazzers",
  "camgirl",
  "cam4",
  "chaturbate",
  "xhamster",
  "spankbang",
  "tnaflix",
  "fapdu",
  "erotic",
  "escort",
  "bet365",
  "casino",
  "phishing",
  "malware",
  "virus",
];

function isSafeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return !MALICIOUS_DOMAINS.some((domain) =>
      parsed.hostname.includes(domain)
    );
  } catch {
    return false;
  }
}

export default function CrearEventoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    image1: "",
    description: "",
    price: "",
    date: "",
    days: [] as string[],
    city: "",
    address: "",
    availableSpots: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setForm({ ...form, [name]: parsedValue });
  };

  const handleDaysChange = (day: string) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (
        !form.name ||
        !form.description ||
        !form.price ||
        (!form.date && form.days.length === 0) ||
        !form.city ||
        !form.address
      ) {
        setError("Por favor, completa todos los campos obligatorios.");
        return;
      }
      if (form.image1 && !isSafeUrl(form.image1)) {
        setError(
          "La URL de la imagen no es válida o proviene de un sitio no permitido."
        );
        return;
      }

      // Aquí iría la lógica para guardar el evento
      const response = await api.post("/events", form);
      console.log("Evento creado:", response.data);
      setSuccess("¡Evento creado exitosamente!");
      setTimeout(() => router.push("/eventos"), 1500);
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-32 pb-16">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Crear nuevo evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-primary">
                Título *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={80}
                placeholder="Nombre del evento"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">
                URL de imagen
              </label>
              <Input
                name="image1"
                value={form.image1}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
              <span className="text-xs text-muted-foreground">
                Solo se permiten URLs de sitios seguros.
              </span>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">
                Descripción *
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={500}
                placeholder="Describe el evento..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">
                  Precio (COP) *
                </label>
                <Input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  type="number"
                  min={0}
                  placeholder="Ej: 50000"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">
                  Aforo (opcional)
                </label>
                <Input
                  name="availableSpots"
                  value={form.availableSpots}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  placeholder="Ej: 30"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">
                  Ciudad *
                </label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Bogotá"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-primary">
                  Dirección *
                </label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-primary">
                Fecha específica
              </label>
              <Input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
              />
              <span className="text-xs text-muted-foreground">
                O selecciona días de la semana:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekDays.map((day) => (
                  <label key={day} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={form.days.includes(day)}
                      onChange={() => handleDaysChange(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm font-medium">
                {success}
              </div>
            )}
            <Button type="submit" size="lg" className="w-full">
              Crear evento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
