import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          <div className="flex flex-col items-center md:items-center">
            <Link href="/" className="flex items-center justify-center w-full mb-6">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/Logolight.png"
                  alt="Andariegos Logo"
                  fill
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/images/Logodark.png"
                  alt="Andariegos Logo"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 text-center">
              Explorando los rincones más fascinantes de Bogotá con tours personalizados
              y experiencias auténticas para viajeros nacionales e internacionales.
            </p>
            <div className="flex space-x-4 justify-center">
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

          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-6">Enlaces</h3>
            <ul className="space-y-3 text-center">
              <li><Link href="/acerca" className="text-muted-foreground hover:text-foreground transition-colors">Acerca de Nosotros</Link></li>
              <li><Link href="/testimonios" className="text-muted-foreground hover:text-foreground transition-colors">Testimonios</Link></li>
              <li><Link href="/preguntas-frecuentes" className="text-muted-foreground hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/politicas" className="text-muted-foreground hover:text-foreground transition-colors">Políticas de Privacidad</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4 text-center">
              <li className="flex items-center space-x-3 justify-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:info@andariegos.co" className="text-muted-foreground hover:text-foreground transition-colors">info@andariegos.co</a>
              </li>
              <li className="flex items-center space-x-3 justify-center">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href="tel:+573001234567" className="text-muted-foreground hover:text-foreground transition-colors">+57 319 5823782</a>
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