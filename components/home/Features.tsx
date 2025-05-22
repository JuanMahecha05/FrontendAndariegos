import { Globe, Calendar, Users, Shield, Map, MessageCircle } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Tours Auténticos',
      description: 'Experiencias diseñadas por bogotanos que conocen cada rincón de la ciudad.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: 'A tu ritmo',
      description: 'Planea tours según tu agenda para maximizar tu experiencia.'
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Grupos Reducidos',
      description: 'Atención personalizada en grupos pequeños para una mejor experiencia.'
    },
    {
      icon: <Map className="h-10 w-10 text-primary" />,
      title: 'Rutas Exclusivas',
      description: 'Acceso a lugares poco conocidos fuera de los circuitos turísticos habituales.'
    }
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">¿Por qué elegir Andariegos?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nos destacamos por ofrecer experiencias auténticas y personalizadas que te conectan con la verdadera esencia de Bogotá.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-6 inline-block p-3 bg-primary/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}