"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  events: z.array(z.number()).min(1, "Selecciona al menos un evento"),
});

interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precio: number;
  imagen: string;
}

const CrearTourForm = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      events: [],
    },
  });

  // Cargar eventos desde el cliente
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`${API_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Respuesta inesperada");
        }

        const parsed = data.map((evento: any) => ({
          id: evento.id,
          nombre: evento.name,
          descripcion: evento.description,
          ubicacion: evento.address,
          precio: evento.price,
          imagen: evento.image1,
        }));

        setEventos(parsed);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`${API_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: user?.sub,
          name: values.title,
          description: values.description,
          eventsIds: values.events,
        }),
      });

      if (!response.ok) throw new Error("Error al crear tour");

      router.push("/mis-tours");
    } catch (error) {
      console.error("Error al crear el tour:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg">Cargando eventos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>Ocurrió un error al cargar los eventos. Intenta más tarde.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 mt-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-primary">Crear Nuevo Tour</CardTitle>
          <CardDescription>
            Complete los detalles para crear un nuevo tour turístico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Tour</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Tour por el Centro Histórico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe los detalles del tour..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Eventos Disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventos.map((evento) => (
                    <FormField
                      key={evento.id}
                      control={form.control}
                      name="events"
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0 bg-card p-4 rounded-lg border"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(evento.id)}
                              onCheckedChange={(checked) => {
                                const updatedEvents = checked
                                  ? [...field.value, evento.id]
                                  : field.value?.filter((id) => id !== evento.id);
                                field.onChange(updatedEvents);
                              }}
                            />
                          </FormControl>
                          <div className="flex gap-4 flex-grow">
                            <div className="flex-shrink-0 w-20 h-20 relative">
                              <img
                                src={evento.imagen}
                                alt={evento.nombre}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{evento.nombre}</FormLabel>
                              <FormDescription>{evento.ubicacion}</FormDescription>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Crear Tour
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearTourForm;