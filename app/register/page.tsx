import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 order-2 md:order-1">
        <div className="w-full max-w-md">
          <div className="flex justify-center md:justify-start mb-8">
            <Link href="/" className="flex items-center text-2xl font-bold text-primary">
              <span>Andariegos</span>
            </Link>
          </div>
          
          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold">Crear cuenta</h1>
            <p className="text-gray-500 mt-2">
              Únete a nuestra comunidad de viajeros en Bogotá
            </p>
          </div>
          
          <RegisterForm />
          
          <p className="text-center mt-8 text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 relative order-1 md:order-2">
        <Image
          src="https://images.pexels.com/photos/6580703/pexels-photo-6580703.jpeg"
          alt="Bogotá cityscape at sunset"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-600/70 to-red-700/40 flex items-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">Únete a Andariegos</h2>
            <p className="text-lg">
              Al registrarte podrás reservar tours personalizados, guardar tus experiencias favoritas y recibir recomendaciones exclusivas para tu viaje a Bogotá.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}