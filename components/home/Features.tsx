import { Globe, Calendar, Users, Shield, Map, MessageCircle } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: 'Tours Auténticos',
      description: 'Experiencias diseñadas por bogotanos que conocen cada rincón de la ciudad.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      title: 'Horarios Flexibles',
      description: 'Adaptamos nuestros tours a tu agenda para maximizar tu experiencia.'
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: 'Grupos Reducidos',
      description: 'Atención personalizada en grupos pequeños para una mejor experiencia.'
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-600" />,
      title: 'Seguridad Garantizada',
      description: 'Tu seguridad es nuestra prioridad, todos nuestros guías están certificados.'
    },
    {
      icon: <Map className="h-10 w-10 text-blue-600" />,
      title: 'Rutas Exclusivas',
      description: 'Acceso a lugares poco conocidos fuera de los circuitos turísticos habituales.'
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-blue-600" />,
      title: 'Guías Multilingües',
      description: 'Nuestros guías hablan varios idiomas para facilitar la comunicación.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir Andariegos?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nos destacamos por ofrecer experiencias auténticas y personalizadas que te conectan con la verdadera esencia de Bogotá.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-6 inline-block p-3 bg-blue-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}