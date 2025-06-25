"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAuth } from "@/hooks/AuthContext";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type Event = {
  idEvent: number;
  nameEvent: string;
};

type Tour = {
  idTour: number;
  idUser: string;
  name: string;
  description: string;
  events: Event[];
};

export default function GestionarToursPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);

  useEffect(() => {
    fetch("http://localhost:7080/api/tours")
      .then((res) => res.json())
      .then((data) => {
        setTours(Array.isArray(data) ? data : data.tours || []);
      })
      .catch((err) => {
        console.error("Error al cargar los tours:", err);
      })
      .finally(() => {
        setLoadingTours(false);
      });
  }, []);

  const handleDelete = async (idTour: number) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este tour?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:7080/api/tours/${idTour}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el tour");
      }

      setTours(prev => prev.filter(t => t.idTour !== idTour));
    } catch (error) {
      console.error("Error eliminando el tour:", error);
    }
  };

  if (isLoading || loadingTours) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-12 mt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestionar Tours</h1>
        <Button
          onClick={() => router.push("/crear-tour")}
          className="bg-primary text-white"
        >
          Crear nuevo tour
        </Button>
      </div>

      {tours.length === 0 ? (
        <p className="text-gray-500">No hay tours registrados actualmente.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Card key={tour.idTour}>
              <CardHeader>
                <CardTitle>{tour.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{tour.description}</p>
                <p className="text-sm font-medium">Eventos:</p>
                <ul className="list-disc pl-5 text-sm">
                  {tour.events.map((event) => (
                    <li key={event.idEvent}>{event.nameEvent}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/editar-tour/${tour.idTour}`)}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(tour.idTour)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
