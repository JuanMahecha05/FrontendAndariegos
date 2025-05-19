import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Andariegos | Tours en Bogotá',
  description: 'Descubre Bogotá con tours personalizados - reserva y crea experiencias únicas en la capital colombiana.',
  keywords: 'tours bogotá, guías turísticos, experiencias colombia, turismo bogotá, viajes personalizados',
  openGraph: {
    title: 'Andariegos | Tours en Bogotá',
    description: 'Descubre Bogotá con tours personalizados - reserva y crea experiencias únicas en la capital colombiana.',
    url: 'https://andariegos.co',
    siteName: 'Andariegos',
    images: [
      {
        url: 'https://images.pexels.com/photos/3588475/pexels-photo-3588475.jpeg',
        width: 1200,
        height: 630,
        alt: 'Andariegos Tours Bogotá',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}