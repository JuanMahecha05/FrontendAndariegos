import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, Award, Heart, Leaf } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'url(/images/acercade.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre Andariegos por Colombia
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Transformando cada viaje en una experiencia auténtica e inolvidable
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                En Andariegos por Colombia, nuestra misión es transformar cada viaje en una experiencia auténtica e inolvidable, conectando a viajeros con la riqueza natural, cultural y gastronómica de Colombia. Permitimos la personalización de rutas que promueven el turismo responsable, impulsan las economías locales y celebran la diversidad de nuestro país, ofreciendo un servicio seguro, acogedor y lleno de magia.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-red-600 mr-3" />
                  <span className="text-lg dark:text-gray-200">Experiencias auténticas y memorables</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-lg dark:text-gray-200">Turismo responsable y sostenible</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-lg dark:text-gray-200">Apoyo a comunidades locales</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-yellow-500 mr-3" />
                  <span className="text-lg dark:text-gray-200">Servicio de excelencia</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/iglesia.jpg"
                alt="Experiencias auténticas en Colombia"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Nuestra Visión</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Ser reconocidos como la operadora de turismo líder en experiencias auténticas en Colombia, destacándonos por nuestro compromiso con la sostenibilidad, la excelencia en el servicio y la pasión por mostrar lo mejor de cada rincón del país. Queremos inspirar a más personas a convertirse en andariegos, promoviendo un turismo consciente que valore, respete y preserve la riqueza de nuestro territorio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 via-blue-50 to-red-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Somos un equipo de 6 apasionados estudiantes dedicados a crear una plataforma moderna, fácil de usar y de calidad.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Daniel Tobar',
                role: 'Frontend',
                image: '/images/dan_cropped.png',
                description: 'Apasionado por el diseño y la experiencia de usuario, encargado de crear interfaces atractivas y funcionales.'
              },
              {
                name: 'Simón Ramos',
                role: 'Backend',
                image: '/images/simon_foto.png',
                description: 'Especialista en desarrollo backend, responsable de la lógica y la arquitectura del servidor.'
              },
              {
                name: 'Miguel Parrado',
                role: 'Backend',
                image: '/images/miguel_foto.png',
                description: 'Dedicado a la optimización y seguridad del backend, asegurando un funcionamiento robusto de la plataforma.'
              },
              {
                name: 'Juan Jaimes',
                role: 'Backend',
                image: '/images/jaimes_foto.png',
                description: 'Experto en integración de servicios y bases de datos, garantizando la eficiencia y escalabilidad del sistema.'
              },
              {
                name: 'Juan Mahecha',
                role: 'Frontend',
                image: '/images/juan_mahecha.jpg',
                description: 'Creativo en el desarrollo de interfaces, enfocado en brindar una experiencia visual moderna y accesible.'
              },
              {
                name: 'Jose Alvarado',
                role: 'Frontend',
                image: '/images/alvarado.jpg',
                description: 'Enfocado en la usabilidad y el diseño responsivo, asegurando que la plataforma sea intuitiva en cualquier dispositivo.'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-300 mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            ¿Listo para explorar Colombia con nosotros?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Únete a nuestra comunidad de viajeros y descubre la magia de nuestro país
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Link href="/tours">Ver Tours Disponibles</Link>
            </Button>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}