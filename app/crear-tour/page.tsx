import CrearTourForm from '@/components/CrearTourForm';

export default function CrearTourPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Tour</h1>
      <CrearTourForm />
    </div>
  );
}