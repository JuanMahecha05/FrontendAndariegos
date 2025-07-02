'use client';

import React from 'react';
import Image from 'next/image';

export default function PoliticasPage() {
  return (
    <>
      <section className="relative h-[400px] w-full">
        <Image
          src="/images/preguntasfrecuentes.jpg"
          alt="Políticas de Privacidad"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white leading-tight md:text-6xl lg:text-7xl drop-shadow-lg">
            Políticas de Privacidad
          </h1>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">

        <div className="bg-card p-8 rounded-lg shadow-xl space-y-8 text-card-foreground leading-relaxed">
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            En <span className="font-bold">Andariegos</span>, valoramos y protegemos la privacidad de nuestros usuarios. Estas políticas de privacidad describen cómo recopilamos, usamos y protegemos su información personal en relación con nuestra aplicación, que permite descubrir, reservar y crear experiencias de tours y eventos.
          </p>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">1. Información que Recopilamos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Recopilamos información para proporcionar y mejorar nuestros servicios. Esto incluye:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-6 text-gray-600 dark:text-gray-400">
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Información de Registro:</span> Cuando crea una cuenta, recopilamos su nombre, nombre de usuario, dirección de correo electrónico y contraseña.</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Información del Perfil:</span> Puede optar por proporcionar información adicional en su perfil, como su foto de perfil o una breve biografía.</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Información de Tours y Eventos:</span> Si crea o reserva tours/eventos, recopilamos detalles relacionados con estas actividades (títulos, descripciones, fechas, ubicaciones, precios, etc.).</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Datos de Uso:</span> Recopilamos información sobre cómo interactúa con nuestra aplicación, como las páginas que visita, los tours que busca o las funciones que utiliza.</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Cookies y Tecnologías Similares:</span> Utilizamos cookies y tecnologías de seguimiento para mejorar su experiencia de usuario, analizar el uso de la aplicación y para fines de autenticación.</li>
          </ul>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">2. Cómo Utilizamos su Información</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-6 text-gray-600 dark:text-gray-400">
            <li>Proporcionar y gestionar su cuenta y nuestros servicios.</li>
            <li>Procesar sus reservas y creaciones de tours/eventos.</li>
            <li>Personalizar su experiencia en la aplicación, mostrando tours y eventos relevantes.</li>
            <li>Mejorar nuestra aplicación, servicios y funcionalidades.</li>
            <li>Comunicarnos con usted sobre su cuenta, actualizaciones, ofertas y notificaciones.</li>
            <li>Garantizar la seguridad y prevenir actividades fraudulentas.</li>
            <li>Cumplir con nuestras obligaciones legales.</li>
          </ul>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">3. Cómo Compartimos su Información</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información en las siguientes circunstancias:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-6 text-gray-600 dark:text-gray-400">
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Organizadores de Eventos/Tours:</span> Si reserva un evento o tour, su nombre de usuario (o nombre si lo ha hecho público) y los detalles de la reserva pueden ser compartidos con el organizador para fines de gestión.</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Proveedores de Servicios:</span> Podemos compartir información con terceros que nos ayudan a operar nuestra aplicación y proporcionar nuestros servicios (por ejemplo, servicios de alojamiento, análisis, procesamiento de pagos). Estos proveedores están obligados contractualmente a proteger su información.</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Cumplimiento Legal:</span> Podemos divulgar su información si así lo exige la ley o en respuesta a solicitudes legales válidas (por ejemplo, una orden judicial o citación).</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">Transferencias de Negocios:</span> En caso de fusión, adquisición o venta de activos, su información puede ser transferida como parte de la transacción.</li>
          </ul>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">4. Seguridad de los Datos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado, la divulgación, la alteración o la destrucción. Sin embargo, ninguna transmisión por Internet o método de almacenamiento electrónico es 100% seguro.
          </p>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">5. Sus Derechos de Privacidad</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Usted tiene derecho a acceder, corregir, actualizar o eliminar su información personal. Para ejercer estos derechos, puede iniciar sesión en su cuenta o contactarnos directamente.
          </p>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">6. Cambios a esta Política de Privacidad</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Podemos actualizar nuestra Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio publicando la nueva política en esta página y actualizando la {'Última actualización'} en la parte superior. Le recomendamos revisar esta política periódicamente.
          </p>

          <h2 className="text-3xl font-bold text-secondary-foreground pt-4 mb-4 border-b-2 border-secondary pb-2">7. Contacto</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Si tiene alguna pregunta sobre estas Políticas de Privacidad, puede contactarnos a:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-6 text-gray-600 dark:text-gray-400">
            <li>Correo electrónico: <a href="mailto:info@andariegos.co" className="text-primary hover:underline">info@andariegos.co</a></li>
            <li>Teléfono: +57 319 5823782</li>
          </ul>
          
          <p className="text-sm text-muted-foreground mt-8 text-right">
            Última actualización: 20 de mayo de 2024
          </p>
        </div>
      </div>
    </>
  );
} 