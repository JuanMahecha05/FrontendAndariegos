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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  events: z.array(z.number()).min(1, "Selecciona al menos un evento"),
});

interface Horario {
  fecha: string;
  inicio: string;
  fin: string;
}

interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  duracion: number;
  precio: number;
  imagen: string;
  horarios: Horario[];
}

interface CrearTourFormProps {
  initialEvents: Evento[];
}

const CrearTourForm = ({ initialEvents }: CrearTourFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      events: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://localhost:7080/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: user?.sub, // o user?.username si el backend usa eso
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
                  {initialEvents.map((evento) => (
                    <FormField
                      key={evento.id}
                      control={form.control}
                      name="events"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={evento.id}
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
                                <FormDescription>
                                  {evento.ubicacion}
                                  <br />
                                  Duración: {evento.duracion}h - Precio: ${evento.precio}
                                  <br />
                                  Horarios disponibles: {evento.horarios.length} días
                                </FormDescription>
                              </div>
                            </div>
                          </FormItem>
                        );
                      }}
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