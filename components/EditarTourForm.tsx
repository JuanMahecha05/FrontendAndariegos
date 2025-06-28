"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Search, GripVertical, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

interface Horario {
  fecha: string;
  inicio: string;
  fin: string;
}

interface Evento {
  id: string | number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  duracion: number;
  precio: number;
  imagen: string;
  horarios: Horario[];
}

interface Tour {
  id: string;
  title: string;
  description: string;
  events: Evento[];
}

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  events: z.array(z.union([z.string(), z.number()])).min(1, "Selecciona al menos un evento"),
});

type FormValues = z.infer<typeof formSchema>;

const SortableEvent = ({ id, evento, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: { 
  id: string | number; 
  evento: Evento; 
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card rounded-lg mb-2 border shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-grow relative h-32">
        <div className="absolute inset-0 w-1/2">
          <div className="relative w-full h-full">
            <img
              src={evento.imagen}
              alt={evento.nombre}
              className="w-full h-full object-cover rounded-l-md"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="w-1/2" />
          <div className="flex-grow pl-8">
            <h4 className="font-medium text-lg text-primary">{evento.nombre}</h4>
            <p className="text-sm text-muted-foreground">
              {evento.ubicacion} - {evento.duracion}h - ${evento.precio}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface EditarTourFormProps {
  tourId: string;
}

export default function EditarTourForm({ tourId }: EditarTourFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, token } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [availableEvents, setAvailableEvents] = useState<Evento[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventsPerPage = 9;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          router.push('/login');
          return;
        }

        // Obtener el tour específico
        const tourResponse = await fetch(`${API_URL}/tours/${tourId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tourResponse.ok) {
          throw new Error(`Error al cargar el tour: ${tourResponse.status}`);
        }

        const tourData = await tourResponse.json();

        // Obtener todos los eventos disponibles
        const eventsResponse = await fetch(`${API_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!eventsResponse.ok) {
          throw new Error(`Error al cargar eventos: ${eventsResponse.status}`);
        }

        const eventsData = await eventsResponse.json();
        const transformedEvents = Array.isArray(eventsData) ? eventsData.map((evento) => ({
          id: evento.id,
          nombre: evento.name,
          descripcion: evento.description,
          ubicacion: evento.address,
          duracion: evento.duration || 1,
          precio: evento.price,
          imagen: evento.image1,
          horarios: evento.timeSlots || []
        })) : [];

        setAvailableEvents(transformedEvents);

        // Enriquecer los eventos seleccionados del tour
        const selectedIds = (tourData.events || tourData.eventIds || []).map((event) => event.id || event);
        const enrichedSelectedEvents = selectedIds
          .map((id) => transformedEvents.find(e => e.id === id))
          .filter(Boolean);

        // Actualizar el estado del tour y del formulario
        const transformedTour = {
          id: tourData.idTour?.toString() || tourId,
          title: tourData.name || tourData.title || '',
          description: tourData.description || '',
          events: enrichedSelectedEvents
        };

        setTour(transformedTour);
        setSelectedEvents(enrichedSelectedEvents);

        // Resetear el formulario con los datos correctos
        form.reset({
          title: transformedTour.title,
          description: transformedTour.description,
          events: enrichedSelectedEvents.map(e => e.id),
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, token, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tour?.title || '',
      description: tour?.description || '',
      events: tour?.events.map(event => event.id) || [],
    },
  });

  useEffect(() => {
    const newTotalPrice = selectedEvents.reduce((sum, evento) => sum + evento.precio, 0);
    const newTotalDuration = selectedEvents.reduce((sum, evento) => sum + evento.duracion, 0);
    
    setTotalPrice(newTotalPrice);
    setTotalDuration(newTotalDuration);
  }, [selectedEvents]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = selectedEvents.findIndex(e => e.id === active.id);
      const newIndex = selectedEvents.findIndex(e => e.id === over.id);
      
      const newEvents = [...selectedEvents];
      const [movedEvent] = newEvents.splice(oldIndex, 1);
      newEvents.splice(newIndex, 0, movedEvent);
      
      setSelectedEvents(newEvents);
      form.setValue('events', newEvents.map(e => e.id));
    }
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newEvents = [...selectedEvents];
    const event = newEvents[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    newEvents.splice(index, 1);
    newEvents.splice(newIndex, 0, event);
    
    setSelectedEvents(newEvents);
    form.setValue('events', newEvents.map(e => e.id));
  };

  const filteredEvents = availableEvents.filter(evento => {
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || evento.horarios.some(h => h.fecha.includes(searchDate));
    return matchesSearch && matchesDate;
  });

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const onSubmit = async (values: FormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Form values:', values);
      console.log('Available events:', availableEvents);

      // Validar que los eventos seleccionados existen
      const validEvents = values.events
        .map((id) => availableEvents.find((e) => e.id === id))
        .filter(Boolean);

      if (validEvents.length === 0) {
        toast({
          title: "Error",
          description: "Debes seleccionar al menos un evento válido",
          variant: "destructive",
        });
        return;
      }

      // Actualizar el tour usando la API
      const response = await fetch(`${API_URL}/tours/${tourId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.title,
          description: values.description,
          eventsIds: validEvents.map(evento => evento.id)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar el tour");
      }

      toast({
        title: "¡Éxito!",
        description: "Tour actualizado correctamente",
      });

      // Redirigir después de un breve delay para que el usuario vea la notificación
      setTimeout(() => {
        router.push('/tours');
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error inesperado",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el tour. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg">Cargando tour y eventos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>Error: {error}</p>
        <Button 
          onClick={() => router.back()} 
          className="mt-4"
        >
          Volver
        </Button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="py-20 text-center">
        <p>Tour no encontrado</p>
        <Button 
          onClick={() => router.back()} 
          className="mt-4"
        >
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 mt-16">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-primary">Editar Tour</CardTitle>
              <CardDescription>Modifica los detalles del tour turístico.</CardDescription>
            </div>
          </div>
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Eventos del Tour</h3>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por nombre..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-[150px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedEvents.map((evento) => (
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
                                    let updatedEvents;
                                    if (checked) {
                                      updatedEvents = [...form.getValues("events"), evento.id];
                                    } else {
                                      updatedEvents = form.getValues("events").filter((id) => id !== evento.id);
                                    }
                                    form.setValue("events", updatedEvents, { shouldValidate: true });
                                    setSelectedEvents(updatedEvents.map(id => availableEvents.find(e => e.id === id)).filter(Boolean) as Evento[]);
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
                                    Duración: {evento.duracion}h | Precio: ${evento.precio}
                                  </FormDescription>
                                </div>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="flex items-center px-3">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {selectedEvents.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Eventos Seleccionados ({selectedEvents.length})</h4>
                    <div className="text-sm text-muted-foreground">
                      Total: ${totalPrice} | Duración: {totalDuration}h
                    </div>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedEvents.map(e => e.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {selectedEvents.map((evento, index) => (
                          <SortableEvent
                            key={evento.id}
                            id={evento.id}
                            evento={evento}
                            onRemove={() => {
                              const newEvents = selectedEvents.filter(e => e.id !== evento.id);
                              setSelectedEvents(newEvents);
                              form.setValue('events', newEvents.map(e => e.id));
                            }}
                            onMoveUp={() => moveEvent(index, 'up')}
                            onMoveDown={() => moveEvent(index, 'down')}
                            isFirst={index === 0}
                            isLast={index === selectedEvents.length - 1}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Tour"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 