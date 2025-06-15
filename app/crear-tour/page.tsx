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
import { Search, GripVertical, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info, Trash2 } from "lucide-react";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// Datos de ejemplo para los eventos
const eventos: Evento[] = [
  {
    id: 1,
    nombre: "Festival de Verano",
    descripcion: "Descripción del Festival de Verano",
    ubicacion: "Parque Simón Bolívar",
    duracion: 4,
    precio: 25,
    imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000",
    horarios: [
      {
        fecha: "2024-07-15",
        inicio: "09:00",
        fin: "13:00"
      },
      {
        fecha: "2024-07-16",
        inicio: "14:00",
        fin: "18:00"
      }
    ]
  },
  {
    id: 2,
    nombre: "Feria del Libro",
    descripcion: "Descripción de la Feria del Libro",
    ubicacion: "Corferias",
    duracion: 3,
    precio: 15,
    imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000",
    horarios: [
      {
        fecha: "2024-08-20",
        inicio: "10:00",
        fin: "13:00"
      }
    ]
  },
  { 
    id: 3, 
    nombre: "Tour Gastronómico", 
    descripcion: "Descripción del Tour Gastronómico", 
    ubicacion: "Centro Histórico",
    duracion: 2,
    precio: 35,
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000",
    horarios: []
  },
  { 
    id: 4, 
    nombre: "Senderismo Monserrate", 
    descripcion: "Descripción del Senderismo Monserrate", 
    ubicacion: "Cerro Monserrate",
    duracion: 5,
    precio: 20,
    imagen: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000",
    horarios: []
  },
  { 
    id: 5, 
    nombre: "Museo del Oro", 
    descripcion: "Descripción del Museo del Oro", 
    ubicacion: "Centro Internacional",
    duracion: 3,
    precio: 10,
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    horarios: []
  },
  { 
    id: 6, 
    nombre: "Tour de Café", 
    descripcion: "Descripción del Tour de Café", 
    ubicacion: "Cundinamarca",
    duracion: 6,
    precio: 45,
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000",
    horarios: []
  },
  { 
    id: 7, 
    nombre: "Cicloruta Nocturna", 
    descripcion: "Descripción de la Cicloruta Nocturna", 
    ubicacion: "Cicloruta Principal",
    duracion: 4,
    precio: 15,
    imagen: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1000",
    horarios: []
  },
  { 
    id: 8, 
    nombre: "Teatro Colón", 
    descripcion: "Descripción del Teatro Colón", 
    ubicacion: "Centro Histórico",
    duracion: 2,
    precio: 30,
    imagen: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000",
    horarios: []
  },
  { 
    id: 9, 
    nombre: "Parque de la 93", 
    descripcion: "Descripción del Parque de la 93", 
    ubicacion: "Chapinero",
    duracion: 3,
    precio: 0,
    imagen: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1000",
    horarios: []
  },
  { 
    id: 10, 
    nombre: "Mercado de Pulgas", 
    descripcion: "Descripción del Mercado de Pulgas", 
    ubicacion: "Usaquén",
    duracion: 4,
    precio: 0,
    imagen: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000",
    horarios: []
  },
  { 
    id: 11, 
    nombre: "Tour de Graffiti", 
    descripcion: "Descripción del Tour de Graffiti", 
    ubicacion: "Chapinero",
    duracion: 3,
    precio: 20,
    imagen: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000",
    horarios: []
  },
  { 
    id: 12, 
    nombre: "Clase de Salsa", 
    descripcion: "Descripción de la Clase de Salsa", 
    ubicacion: "Centro de Baile",
    duracion: 2,
    precio: 25,
    imagen: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000",
    horarios: []
  },
  { 
    id: 13, 
    nombre: "Tour de Museos", 
    descripcion: "Descripción del Tour de Museos", 
    ubicacion: "Centro Histórico",
    duracion: 5,
    precio: 40,
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    horarios: []
  },
  { 
    id: 14, 
    nombre: "Parque Nacional", 
    descripcion: "Descripción del Parque Nacional", 
    ubicacion: "Parque Nacional",
    duracion: 6,
    precio: 15,
    imagen: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000",
    horarios: []
  },
  { 
    id: 15, 
    nombre: "Tour de Compras", 
    descripcion: "Descripción del Tour de Compras", 
    ubicacion: "Centro Comercial",
    duracion: 4,
    precio: 0,
    imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000",
    horarios: []
  }
];

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  startLocation: z.string().min(1, "La ubicación inicial es requerida"),
  endLocation: z.string().min(1, "La ubicación final es requerida"),
  events: z.array(z.number()).min(1, "Selecciona al menos un evento"),
});

const SortableEvent = ({ id, evento, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: { 
  id: number; 
  evento: Evento; 
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [showHorarios, setShowHorarios] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const diasSemana = [
    "Domingo", "Lunes", "Martes", "Miércoles", 
    "Jueves", "Viernes", "Sábado"
  ];

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
          variant="outline"
          size="sm"
          onClick={() => setShowHorarios(true)}
        >
          Ver Horarios
        </Button>
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

      <Dialog open={showHorarios} onOpenChange={setShowHorarios}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Horarios Disponibles - {evento.nombre}</DialogTitle>
            <DialogDescription>
              Horarios disponibles para cada día de la semana
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diasSemana.map((dia, index) => {
              const horariosDelDia = evento.horarios.filter(h => 
                new Date(h.fecha).getDay() === index
              );
              
              return (
                <div key={dia} className="space-y-2">
                  <h4 className="font-medium">{dia}</h4>
                  {horariosDelDia.length > 0 ? (
                    <div className="space-y-1">
                      {horariosDelDia.map((horario, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          {horario.inicio} - {horario.fin}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay horarios disponibles</p>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHorarios(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CrearTour = () => {
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startLocation: "",
      endLocation: "",
      events: [],
    },
  });

  useEffect(() => {
    const selectedEventos = eventos.filter(evento => selectedEvents.includes(evento));
    const newTotalPrice = selectedEventos.reduce((sum, evento) => sum + evento.precio, 0);
    const newTotalDuration = selectedEventos.reduce((sum, evento) => sum + evento.duracion, 0);
    
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

  const filteredEvents = eventos.filter(evento => {
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || evento.fecha.includes(searchDate);
    return matchesSearch && matchesDate;
  });

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tourData = {
      ...values,
      totalPrice,
      totalDuration,
      eventSequence: selectedEvents.map(e => e.id),
    };
    console.log(tourData);
  };

  return (
    <div className="container mx-auto py-10 mt-16">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-primary">Crear Nuevo Tour</CardTitle>
          <CardDescription>Complete los detalles para crear un nuevo tour turístico.</CardDescription>
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
                                    const updatedEvents = checked
                                      ? [...field.value, evento.id]
                                      : field.value?.filter((id) => id !== evento.id);
                                    field.onChange(updatedEvents);
                                    setSelectedEvents(updatedEvents.map(id => eventos.find(e => e.id === id)).filter(Boolean) as Evento[]);
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
                                    {evento.fecha} - {evento.ubicacion}
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

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {selectedEvents.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary">Secuencia del Tour</h3>
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

              {selectedEvents.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-xl font-semibold text-primary">Resumen del Tour</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p>Duración total: {totalDuration} horas</p>
                      <p>Precio total: ${totalPrice}</p>
                    </div>
                    <div className="space-y-2">
                      <p>Ubicación inicial: {selectedEvents[0]?.ubicacion}</p>
                      <p>Ubicación final: {selectedEvents[selectedEvents.length - 1]?.ubicacion}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">Crear Tour</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearTour;