"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // ← NUEVO
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth state changed (Navbar)");
      setRefreshKey((prev) => prev + 1); // ← Fuerza re-render
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    return () => window.removeEventListener("auth-state-changed", handleAuthChange);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/tours", label: "Tours" },
    { href: "/eventos", label: "Eventos" },
    { href: "/acerca", label: "Acerca de" },
    { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
    { href: "/contacto", label: "Contacto" },
  ];

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
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
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      key={refreshKey} // ← CLAVE PARA FORZAR RERENDER
      className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md"
    >
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
              <li key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={`transition-all duration-300 hover:text-primary dark:hover:text-white ${
                    pathname === link.href
                      ? "text-primary dark:text-white font-medium"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary dark:bg-white transform scale-x-100 transition-transform duration-300" />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  asChild
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/avatars/01.png"
                        alt={user?.name || ""}
                      />
                      <AvatarFallback>
                        {user?.name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.roles?.includes("ORGANIZER") && (
                    <DropdownMenuItem asChild>
                      <Link href="/eventos-admin">Gestionar Eventos</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.roles?.includes("ORGANIZER") && (
                    <DropdownMenuItem asChild>
                      <Link href="/mis-tours">Gestionar Tours</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/eventos-reservados">Mis Reservas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              {!isAuthenticated ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Link href="/login" onClick={closeMenu}>Iniciar sesión</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-white dark:text-primary dark:hover:bg-white/90"
                  >
                    <Link href="/register" onClick={closeMenu}>Registrarse</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user?.name || ""} />
                      <AvatarFallback>
                        {user?.name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  {user?.roles?.includes("ORGANIZER") && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/eventos-admin" onClick={closeMenu}>Gestionar Eventos</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/eventos-reservados" onClick={closeMenu}>Mis Reservas</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={() => {
                    logout();
                    closeMenu();
                  }}>
                    Cerrar sesión
                  </Button>
                </>
              )}
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
