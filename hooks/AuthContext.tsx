'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export type Role = 'USER' | 'ORGANIZER' | 'ADMIN';

type User = {
  name: string;
  username: string;
  email: string;
  roles: Role[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<User & { roles: Role[] }>(token);
      Cookies.set('client_token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      });
      setUser(decoded);
      setToken(token);
      setIsInitialized(true);
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  };

  const logout = () => {
    Cookies.remove('client_token');
    setUser(null);
    setToken(null);
    setIsInitialized(true);
    router.push('/');
  };

  useEffect(() => {
    const storedToken = Cookies.get('client_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<User & { roles: Role[] }>(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        console.error('Token inválido al cargar:', error);
        logout();
      }
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, token, login, logout }}>
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
