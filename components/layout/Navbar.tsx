"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/AuthContext';

export enum Role {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/tours", label: "Tours" },
    { href: "/eventos", label: "Eventos" },
    { href: "/acerca", label: "Acerca de" },
    { href: "/contacto", label: "Contacto" },
  ];

 
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <div className="relative h-20 w-80">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-primary dark:hover:text-white ${
                    pathname === link.href
                      ? "text-primary dark:text-white font-medium"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white dark:bg-white dark:text-primary dark:hover:bg-white/90"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 focus:outline-none">
                    <User className="h-6 w-6 text-primary" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-background rounded-md shadow-lg p-2 min-w-[180px]">
                  <DropdownMenu.Label className="px-2 py-1 text-xs text-muted-foreground">
                    {user?.name}
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item asChild>
                    <Link href="/perfil" className="block px-2 py-1 text-sm hover:bg-secondary rounded">Perfil</Link>
                  </DropdownMenu.Item>
                  {user?.roles.includes(Role.ADMIN) && (
                    <DropdownMenu.Item asChild>
                      <Link href="/admin" className="block px-2 py-1 text-sm hover:bg-secondary rounded">Panel de administración</Link>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item onSelect={logout} className="px-2 py-1 text-sm text-red-600 hover:bg-secondary rounded cursor-pointer">Salir</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            <div className="ml-4 border-l pl-4 border-border">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 transition-colors hover:text-primary dark:hover:text-white ${
                      pathname === link.href
                        ? "text-primary dark:text-white font-medium"
                        : "text-foreground"
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col space-y-4 mt-6">
              <Button
                asChild
                variant="outline"
                className="w-full hover:bg-secondary hover:text-secondary-foreground"
              >
                <Link href="/login" onClick={closeMenu}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-white dark:text-primary dark:hover:bg-white/90"
              >
                <Link href="/register" onClick={closeMenu}>
                  Registrarse
                </Link>
              </Button>
              <div className="flex justify-center pt-4 border-t border-border">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { Navbar };
