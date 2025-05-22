import Image from 'next/image'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'María Fernanda López',
      location: 'México',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      rating: 5,
      text: 'El tour por La Candelaria fue una experiencia increíble. Nuestro guía conocía cada rincón y su historia. ¡Altamente recomendado!'
    },
    {
      id: 2,
      name: 'John Smith',
      location: 'Estados Unidos',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rating: 5,
      text: 'Andariegos nos dio una experiencia auténtica y segura por barrios que jamás hubiéramos conocido por nuestra cuenta. Los guías son muy profesionales.'
    },
    {
      id: 3,
      name: 'Luisa Gómez',
      location: 'España',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
      rating: 4,
      text: 'El tour gastronómico fue delicioso, probamos platos típicos en lugares auténticos que no aparecen en las guías turísticas. Una experiencia para el paladar.'
    },
    {
      id: 4,
      name: 'Thomas Weber',
      location: 'Alemania',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
      rating: 5,
      text: 'El tour personalizado que creamos con la ayuda de Andariegos fue perfecto. Conocimos exactamente lo que queríamos a nuestro propio ritmo.'
    }
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Lo que dicen nuestros viajeros</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experiencias reales de quienes han descubierto Bogotá con nosotros
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">&ldquo;{testimonial.text}&rdquo;</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}