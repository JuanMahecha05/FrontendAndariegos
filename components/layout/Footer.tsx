import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Andariegos</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Explorando los rincones más fascinantes de Bogotá con tours personalizados
              y experiencias auténticas para viajeros nacionales e internacionales.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Tours</h3>
            <ul className="space-y-3">
              <li><Link href="/tours/historicos" className="text-muted-foreground hover:text-foreground transition-colors">Tours Históricos</Link></li>
              <li><Link href="/tours/gastronomicos" className="text-muted-foreground hover:text-foreground transition-colors">Tours Gastronómicos</Link></li>
              <li><Link href="/tours/naturaleza" className="text-muted-foreground hover:text-foreground transition-colors">Tours de Naturaleza</Link></li>
              <li><Link href="/tours/culturales" className="text-muted-foreground hover:text-foreground transition-colors">Tours Culturales</Link></li>
              <li><Link href="/tours/personalizados" className="text-muted-foreground hover:text-foreground transition-colors">Tours Personalizados</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Enlaces</h3>
            <ul className="space-y-3">
              <li><Link href="/acerca" className="text-muted-foreground hover:text-foreground transition-colors">Acerca de Nosotros</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/testimonios" className="text-muted-foreground hover:text-foreground transition-colors">Testimonios</Link></li>
              <li><Link href="/preguntas-frecuentes" className="text-muted-foreground hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/politicas" className="text-muted-foreground hover:text-foreground transition-colors">Políticas de Privacidad</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Centro Histórico, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:info@andariegos.co" className="text-muted-foreground hover:text-foreground transition-colors">info@andariegos.co</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href="tel:+573001234567" className="text-muted-foreground hover:text-foreground transition-colors">+57 300 123 4567</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Andariegos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}