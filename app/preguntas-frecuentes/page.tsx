import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Cómo puedo reservar un tour?",
    answer: "Puedes reservar un tour de tres formas: 1) A través de nuestra página web seleccionando el tour deseado y completando el formulario de reserva, 2) Llamando a nuestro número de atención al cliente (+57 319 5823782), o 3) Enviando un correo electrónico a info@andariegos.co con tus preferencias."
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer: "Las cancelaciones realizadas con más de 48 horas de anticipación reciben un reembolso completo. Para cancelaciones entre 24 y 48 horas antes del tour, se aplica un cargo del 50%. Las cancelaciones con menos de 24 horas de anticipación no son reembolsables."
  },
  {
    question: "¿Los tours incluyen transporte?",
    answer: "Sí, todos nuestros tours incluyen transporte desde y hacia puntos específicos de encuentro en Bogotá. El transporte puede ser en vehículos privados o en minibuses, dependiendo del tamaño del grupo."
  },
  {
    question: "¿Qué debo llevar a los tours?",
    answer: "Recomendamos llevar ropa cómoda y adecuada para el clima de Bogotá, zapatos cómodos para caminar, una chaqueta ligera (el clima puede cambiar rápidamente), agua, protector solar y una cámara para capturar los momentos especiales."
  },
  {
    question: "¿Los tours son accesibles para personas con movilidad reducida?",
    answer: "Sí, ofrecemos tours adaptados para personas con movilidad reducida. Por favor, indícanos tus necesidades específicas al momento de la reserva para asegurarnos de proporcionar la mejor experiencia posible."
  },
  {
    question: "¿Ofrecen tours privados?",
    answer: "Sí, ofrecemos tours privados personalizados. Estos tours te permiten diseñar tu propia experiencia con un guía dedicado. Los precios varían según la duración, el número de personas y las actividades seleccionadas."
  },
  {
    question: "¿Qué idiomas hablan los guías?",
    answer: "Nuestros guías hablan español e inglés. Algunos también hablan otros idiomas como francés, alemán y portugués. Por favor, especifica tu preferencia de idioma al hacer la reserva."
  },
  {
    question: "¿Los tours son adecuados para niños?",
    answer: "Sí, muchos de nuestros tours son familiares y adecuados para niños. Sin embargo, algunos tours pueden tener restricciones de edad debido a su naturaleza o duración. Consulta la descripción específica de cada tour o contáctanos para más información."
  },
  {
    question: "¿Cómo se manejan las condiciones climáticas?",
    answer: "Los tours operan normalmente en condiciones de lluvia ligera. En caso de condiciones climáticas extremas que puedan afectar la seguridad, nos pondremos en contacto contigo para reprogramar o cancelar el tour, ofreciendo un reembolso completo."
  },
  {
    question: "¿Puedo personalizar un tour existente?",
    answer: "Sí, puedes personalizar cualquier tour existente. Podemos ajustar la duración, las paradas, el horario y otros aspectos según tus preferencias. Contáctanos con al menos 48 horas de anticipación para discutir las opciones de personalización."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0">
          <img
            src="/images/preguntasfrecuentes.jpg"
            alt="Preguntas Frecuentes"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
            <p className="text-lg">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cómo puedo reservar un tour?</AccordionTrigger>
              <AccordionContent>
                Puedes reservar un tour de varias formas:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>A través de nuestra página web</li>
                  <li>Llamando a nuestro número de atención al cliente</li>
                  <li>Enviando un correo electrónico a reservas@andariegos.com</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>¿Cuál es la política de cancelación?</AccordionTrigger>
              <AccordionContent>
                Nuestra política de cancelación es la siguiente:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Cancelación con más de 48 horas de anticipación: reembolso completo</li>
                  <li>Cancelación entre 24 y 48 horas: reembolso del 50%</li>
                  <li>Cancelación con menos de 24 horas: no hay reembolso</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>¿Qué incluye el precio del tour?</AccordionTrigger>
              <AccordionContent>
                El precio incluye:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Guía turístico profesional</li>
                  <li>Transporte durante el tour</li>
                  <li>Entradas a los lugares visitados</li>
                  <li>Seguro de viaje</li>
                  <li>Snacks y agua</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>¿Cuánto tiempo duran los tours?</AccordionTrigger>
              <AccordionContent>
                La duración varía según el tipo de tour:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Tours de medio día: 4-5 horas</li>
                  <li>Tours de día completo: 8-10 horas</li>
                  <li>Tours nocturnos: 3-4 horas</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>¿Qué debo llevar al tour?</AccordionTrigger>
              <AccordionContent>
                Recomendamos llevar:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Ropa cómoda y adecuada para el clima</li>
                  <li>Zapatos cómodos para caminar</li>
                  <li>Cámara fotográfica</li>
                  <li>Protector solar</li>
                  <li>Dinero extra para compras personales</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>¿Los tours son en grupo o privados?</AccordionTrigger>
              <AccordionContent>
                Ofrecemos ambas opciones:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Tours en grupo: máximo 15 personas</li>
                  <li>Tours privados: personalizados según tus necesidades</li>
                  <li>Tours VIP: grupos pequeños de máximo 6 personas</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>¿Ofrecen tours en otros idiomas?</AccordionTrigger>
              <AccordionContent>
                Sí, ofrecemos tours en:
                <ul className="list-disc ml-6 mt-2 text-foreground">
                  <li>Español</li>
                  <li>Inglés</li>
                  <li>Francés</li>
                  <li>Alemán</li>
                </ul>
                Para otros idiomas, consulta con nuestro equipo de reservas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
} 