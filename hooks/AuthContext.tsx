'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { decryptToken, isValidJWT } from '@/lib/utils';

export type Role = 'USER' | 'ORGANIZER' | 'ADMIN';

type User = {
  name: string;
  username: string;
  email: string;
  roles: Role[];
  id?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const processToken = (rawToken: string): string => {
    try {
      // Si el token ya es un JWT válido, usarlo directamente
      if (isValidJWT(rawToken)) {
        return rawToken;
      }
      
      // Si no, intentar desencriptarlo
      const decryptedToken = decryptToken(rawToken);
      
      // Verificar que el token desencriptado sea válido
      if (isValidJWT(decryptedToken)) {
        return decryptedToken;
      }
      
      throw new Error('Token inválido después de desencriptar');
    } catch (error) {
      console.error('Error procesando token:', error);
      throw new Error('Token inválido');
    }
  };

  const login = (rawToken: string) => {
    try {
      setIsLoading(true);
      const processedToken = processToken(rawToken);
      const decoded = jwtDecode<User & { roles: Role[] }>(processedToken);
      
      // Guardar el token procesado en cookies
      Cookies.set('client_token', processedToken, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      });
      
      setUser(decoded);
      setToken(processedToken);
      setIsInitialized(true);
      
      // Forzar re-render del navbar
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    } catch (error) {
      console.error('Error en login:', error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('client_token');
    setUser(null);
    setToken(null);
    setIsInitialized(true);
    setIsLoading(false);
    
    // Forzar re-render del navbar
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    router.push('/');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = Cookies.get('client_token');
        
        if (storedToken) {
          const processedToken = processToken(storedToken);
          const decoded = jwtDecode<User & { roles: Role[] }>(processedToken);
          
          // Verificar que el token no haya expirado
          const currentTime = Date.now() / 1000;
          if ((decoded as any).exp && (decoded as any).exp < currentTime) {
            console.log('Token expirado');
            logout();
            return;
          }
          
          setUser(decoded);
          setToken(processedToken);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        logout();
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      // Forzar re-render cuando cambie el estado de auth
      if (user) {
        setUser({ ...user });
      }
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, [user]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      token, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
