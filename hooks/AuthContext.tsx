'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

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
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<User & { roles: Role[] }>(token);
      Cookies.set('access_token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      });
      setUser(decoded);
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<User & { roles: Role[] }>(token);
        setUser(decoded);
      } catch (error) {
        console.error('Token inválido al cargar:', error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
