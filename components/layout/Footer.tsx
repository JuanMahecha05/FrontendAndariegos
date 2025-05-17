import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <MapPin className="h-6 w-6" />
              <span className="text-xl font-bold">Andariegos</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Explorando los rincones más fascinantes de Bogotá con tours personalizados
              y experiencias auténticas para viajeros nacionales e internacionales.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Tours</h3>
            <ul className="space-y-3">
              <li><Link href="/tours/historicos" className="text-gray-300 hover:text-white transition-colors">Tours Históricos</Link></li>
              <li><Link href="/tours/gastronomicos" className="text-gray-300 hover:text-white transition-colors">Tours Gastronómicos</Link></li>
              <li><Link href="/tours/naturaleza" className="text-gray-300 hover:text-white transition-colors">Tours de Naturaleza</Link></li>
              <li><Link href="/tours/culturales" className="text-gray-300 hover:text-white transition-colors">Tours Culturales</Link></li>
              <li><Link href="/tours/personalizados" className="text-gray-300 hover:text-white transition-colors">Tours Personalizados</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Enlaces</h3>
            <ul className="space-y-3">
              <li><Link href="/acerca" className="text-gray-300 hover:text-white transition-colors">Acerca de Nosotros</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/testimonios" className="text-gray-300 hover:text-white transition-colors">Testimonios</Link></li>
              <li><Link href="/preguntas-frecuentes" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/politicas" className="text-gray-300 hover:text-white transition-colors">Políticas de Privacidad</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-300" />
                <span className="text-gray-300">Centro Histórico, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-300" />
                <a href="mailto:info@andariegos.co" className="text-gray-300 hover:text-white transition-colors">info@andariegos.co</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-300" />
                <a href="tel:+573001234567" className="text-gray-300 hover:text-white transition-colors">+57 300 123 4567</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Andariegos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}