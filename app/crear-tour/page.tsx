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
import { useState, useEffect, useRef } from "react";
import { Search, GripVertical, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info, User } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/AuthContext';

// Datos de ejemplo para los eventos
const eventos = [
  { 
    id: 1, 
    nombre: "Festival de Verano", 
    fecha: "2024-07-15", 
    ubicacion: "Parque Simón Bolívar",
    duracion: 4,
    precio: 25,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000"
  },
  { 
    id: 2, 
    nombre: "Feria del Libro", 
    fecha: "2024-08-20", 
    ubicacion: "Corferias",
    duracion: 3,
    precio: 15,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000"
  },
  { 
    id: 3, 
    nombre: "Tour Gastronómico", 
    fecha: "2024-09-10", 
    ubicacion: "Centro Histórico",
    duracion: 2,
    precio: 35,
    categoria: "gastronomico",
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000"
  },
  { 
    id: 4, 
    nombre: "Senderismo Monserrate", 
    fecha: "2024-10-05", 
    ubicacion: "Cerro Monserrate",
    duracion: 5,
    precio: 20,
    categoria: "naturaleza",
    imagen: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000"
  },
  { 
    id: 5, 
    nombre: "Museo del Oro", 
    fecha: "2024-11-15", 
    ubicacion: "Centro Internacional",
    duracion: 3,
    precio: 10,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"
  },
  { 
    id: 6, 
    nombre: "Tour de Café", 
    fecha: "2024-12-01", 
    ubicacion: "Cundinamarca",
    duracion: 6,
    precio: 45,
    categoria: "gastronomico",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000"
  },
  { 
    id: 7, 
    nombre: "Cicloruta Nocturna", 
    fecha: "2025-01-10", 
    ubicacion: "Cicloruta Principal",
    duracion: 4,
    precio: 15,
    categoria: "deportivo",
    imagen: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1000"
  },
  { 
    id: 8, 
    nombre: "Teatro Colón", 
    fecha: "2025-02-20", 
    ubicacion: "Centro Histórico",
    duracion: 2,
    precio: 30,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000"
  },
  { 
    id: 9, 
    nombre: "Parque de la 93", 
    fecha: "2025-03-15", 
    ubicacion: "Chapinero",
    duracion: 3,
    precio: 0,
    categoria: "naturaleza",
    imagen: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1000"
  },
  { 
    id: 10, 
    nombre: "Mercado de Pulgas", 
    fecha: "2025-04-01", 
    ubicacion: "Usaquén",
    duracion: 4,
    precio: 0,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000"
  },
  { 
    id: 11, 
    nombre: "Tour de Graffiti", 
    fecha: "2025-05-10", 
    ubicacion: "Chapinero",
    duracion: 3,
    precio: 20,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000"
  },
  { 
    id: 12, 
    nombre: "Clase de Salsa", 
    fecha: "2025-06-20", 
    ubicacion: "Centro de Baile",
    duracion: 2,
    precio: 25,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000"
  },
  { 
    id: 13, 
    nombre: "Tour de Museos", 
    fecha: "2025-07-15", 
    ubicacion: "Centro Histórico",
    duracion: 5,
    precio: 40,
    categoria: "cultural",
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"
  },
  { 
    id: 14, 
    nombre: "Parque Nacional", 
    fecha: "2025-08-01", 
    ubicacion: "Parque Nacional",
    duracion: 6,
    precio: 15,
    categoria: "naturaleza",
    imagen: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000"
  },
  { 
    id: 15, 
    nombre: "Tour de Compras", 
    fecha: "2025-09-10", 
    ubicacion: "Centro Comercial",
    duracion: 4,
    precio: 0,
    categoria: "compras",
    imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000"
  }
];

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  events: z.array(z.number()).min(1, "Selecciona al menos un evento"),
  image: z.string().optional(),
});

export default function CrearTour() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  // Redirección si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!user?.roles?.includes('ORGANIZER')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9; // 3 rows of 3 events
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState("");

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
      events: [],
      image: "",
    },
  });

  const [openGuiaMenuIdx, setOpenGuiaMenuIdx] = useState<number | null>(null);
  const toggleGuiaMenu = (idx: number) => {
    setOpenGuiaMenuIdx(prev => (prev === idx ? null : idx));
  };

  useEffect(() => {
    const selectedEventos = eventos.filter(evento => selectedEvents.includes(evento.id));
    const newTotalPrice = selectedEventos.reduce((sum, evento) => sum + evento.precio, 0);
    const newTotalDuration = selectedEventos.reduce((sum, evento) => sum + evento.duracion, 0);
    const uniqueCategories = Array.from(new Set(selectedEventos.map(evento => evento.categoria)));
    
    setTotalPrice(newTotalPrice);
    setTotalDuration(newTotalDuration);
    setCategories(uniqueCategories);
  }, [selectedEvents]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedEvents((items) => {
        const oldIndex = items.indexOf(Number(active.id));
        const newIndex = items.indexOf(Number(over.id));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newEvents = [...selectedEvents];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newEvents[index], newEvents[newIndex]] = [newEvents[newIndex], newEvents[index]];
    setSelectedEvents(newEvents);
    form.setValue('events', newEvents);
  };

  const filteredEvents = eventos.filter(evento => {
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || evento.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(eventos.map(evento => evento.categoria)));

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Guías de ejemplo
  const posiblesGuias = [
    { id: 1, nombre: 'Guía Juan', experiencia: '5 años', especialidad: 'Cultural' },
    { id: 2, nombre: 'Guía María', experiencia: '3 años', especialidad: 'Gastronómico' },
    { id: 3, nombre: 'Guía Carlos', experiencia: '7 años', especialidad: 'Naturaleza' },
  ];

  // Estado para selección de guías por evento
  const [guiaPorEvento, setGuiaPorEvento] = useState<any>({});
  const handleGuiaChange = (eventoIdx: number, guiaId: string) => {
    setGuiaPorEvento((prev: any) => ({ ...prev, [eventoIdx]: guiaId }));
  };

  // Estado para el modal de confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingTour, setPendingTour] = useState<any>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPendingTour({
      ...values,
      totalPrice,
      totalDuration,
      categories,
      eventSequence: selectedEvents.map(id => eventos.find(e => e.id === id)),
      image: values.image,
    });
    setOpenConfirm(true);
  }

  const handleConfirmReserva = () => {
    if (!(window as any).eventosReservados) (window as any).eventosReservados = [];
    (window as any).eventosReservados.push(pendingTour);
    setOpenConfirm(false);
    router.push('/eventos-reservados');
  };

  // Handler para submit fallido
  const handleInvalid = (errors: any) => {
    setSubmitAttempted(true);
    setFormError("Por favor completa todos los campos requeridos y selecciona al menos un evento.");
    console.log("Errores de validación:", errors);
  };

  function SortableEvent({ id, evento, onRemove, onMoveUp, onMoveDown, isFirst, isLast, guia, onGuiaClick, guiaMenuOpen, posiblesGuias, onGuiaSelect, idx }: any) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const guiaBtnRef = useRef<HTMLButtonElement>(null);
    const [menuPos, setMenuPos] = useState<{top: number, left: number}>({top: 0, left: 0});

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
      if (!guiaMenuOpen) return;
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.guia-menu') && !target.closest('.guia-button')) {
          onGuiaClick();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [guiaMenuOpen, onGuiaClick]);

    // Calcular posición del menú a la izquierda del botón
    useEffect(() => {
      if (guiaMenuOpen && guiaBtnRef.current) {
        const rect = guiaBtnRef.current.getBoundingClientRect();
        const menuWidth = 210;
        let left = rect.left + window.scrollX - menuWidth;
        // Si no hay espacio a la izquierda, mostrar a la derecha
        if (left < 0) {
          left = rect.right + window.scrollX + 8; // 8px de separación
        }
        setMenuPos({
          top: rect.top + window.scrollY,
          left,
        });
      }
    }, [guiaMenuOpen]);

    return (
      <motion.div
        ref={setNodeRef}
        style={{ 
          transform: CSS.Transform.toString(transform), 
          transition,
          zIndex: guiaMenuOpen ? 50 : isDragging ? 1 : 0,
        }}
        className={`flex items-center gap-4 p-4 bg-card rounded-lg mb-2 border shadow-sm relative ${isDragging ? 'opacity-50' : ''}`}
      >
        <div {...attributes} {...listeners} className="cursor-grab touch-none select-none">
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
        <div className="flex items-center gap-2 mr-2 relative">
          <div className="flex flex-col items-center">
            <button
              type="button"
              ref={guiaBtnRef}
              className="guia-button p-2 rounded-full bg-gray-100 hover:bg-yellow-200 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onGuiaClick();
              }}
              title="Seleccionar guía"
            >
              <User className="h-5 w-5 text-primary" />
            </button>
            <span className="text-xs mt-1 text-gray-600 font-medium">{guia ? guia : 'Sin guía'}</span>
          </div>
          {guiaMenuOpen && (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="guia-menu absolute right-full -ml-4 top-0 bg-white border rounded shadow-lg p-2 w-52 z-50"
              style={{ minHeight: 120 }}
            >
              <div className="mb-2 font-semibold text-sm">Guía para este evento:</div>
              <button 
                className="block w-full text-left px-2 py-1 hover:bg-yellow-100 rounded" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGuiaSelect("");
                }}
              >
                Sin guía
              </button>
              {posiblesGuias.map((guia: any) => (
                <button 
                  key={guia.id} 
                  className="block w-full text-left px-2 py-1 hover:bg-yellow-100 rounded" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onGuiaSelect(guia.nombre);
                  }}
                >
                  {guia.nombre} ({guia.especialidad}, {guia.experiencia})
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <div className="flex-shrink-0 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-10 mt-28">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-primary">Crear Nuevo Tour</CardTitle>
          <CardDescription>Complete los detalles para crear un nuevo tour turístico.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)} className="space-y-8">
              {/* Información básica */}
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
                  {formError}
                </div>
              )}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-primary">Información del Tour</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Título del Tour</FormLabel>
                          <div onClick={(e) => e.stopPropagation()}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Un nombre descriptivo y atractivo para tu tour. Este será lo primero que verán los usuarios.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <FormControl>
                          <Input placeholder="Ej: Tour por el Centro Histórico" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>URL de la imagen</FormLabel>
                          <div onClick={(e) => e.stopPropagation()}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>URL de una imagen representativa para el tour. Esta imagen se mostrará en la lista de tours.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Descripción</FormLabel>
                        <div onClick={(e) => e.stopPropagation()}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Describe los detalles más importantes de tu tour. Incluye información sobre los lugares, actividades y experiencias que ofreces.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
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
              </div>

              {/* Selección de eventos */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-primary">Eventos Disponibles</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">Todas las categorías</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedEvents.map((evento, index) => (
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
                                  setSelectedEvents(updatedEvents);
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
                                  Categoría: {evento.categoria}
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

              {/* Secuencia del tour */}
              {selectedEvents.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary">Secuencia del Tour</h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedEvents}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {selectedEvents.map((eventId, index) => {
                          const evento = eventos.find(e => e.id === eventId);
                          if (!evento) return null;
                          return (
                            <SortableEvent
                              key={eventId}
                              id={eventId}
                              evento={evento}
                              onRemove={() => {
                                const newEvents = selectedEvents.filter(id => id !== eventId);
                                setSelectedEvents(newEvents);
                                form.setValue('events', newEvents);
                              }}
                              onMoveUp={() => moveEvent(index, 'up')}
                              onMoveDown={() => moveEvent(index, 'down')}
                              isFirst={index === 0}
                              isLast={index === selectedEvents.length - 1}
                              guia={guiaPorEvento[index] || ''}
                              onGuiaClick={() => toggleGuiaMenu(index)}
                              guiaMenuOpen={openGuiaMenuIdx === index}
                              posiblesGuias={posiblesGuias}
                              onGuiaSelect={(guia: string) => { handleGuiaChange(index, guia); toggleGuiaMenu(index); }}
                              idx={index}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Resumen del tour */}
              {selectedEvents.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-xl font-semibold text-primary">Resumen del Tour</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p>Duración total: {totalDuration} horas</p>
                      <p>Precio total: ${totalPrice}</p>
                      <p>Categorías: {categories.join(", ")}</p>
                    </div>
                    <div className="space-y-2">
                      <p>Ubicación inicial: {eventos.find(e => e.id === selectedEvents[0])?.ubicacion}</p>
                      <p>Ubicación final: {eventos.find(e => e.id === selectedEvents[selectedEvents.length - 1])?.ubicacion}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">Reservar Tour</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro que quieres reservar este tour?</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-lg">Esta acción reservará el tour y lo agregará a tus eventos reservados.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>Cancelar</Button>
            <Button variant="default" onClick={handleConfirmReserva}>Confirmar Reserva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}