import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/loginimg.jpg"
          alt="Bogotá cityscape"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-transparent flex items-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">Bienvenido de nuevo a Andariegos</h2>
            <p className="text-lg text-blue-100">
              Accede a tu cuenta para agendar tours, crear experiencias personalizadas y administrar tus itinerarios en Bogotá.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center md:justify-start mb-8">
            <Link href="/" className="flex items-center text-2xl font-bold text-primary">
              <span>Andariegos</span>
            </Link>
          </div>
          
          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold">Iniciar sesión</h1>
            <p className="text-gray-500 mt-2">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>
          
          <LoginForm />
          
          <p className="text-center mt-8 text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:underline font-medium"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}