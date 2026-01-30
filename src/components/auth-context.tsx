'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginResponse, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario guardado al montar el componente
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login fallido');
        }

        const data: LoginResponse = await response.json();

        // Guardar en estado
        setUser(data.data.user);
        setToken(data.data.token);

        // Guardar en localStorage (persistencia)
        localStorage.setItem('auth_user', JSON.stringify(data.data.user));
        localStorage.setItem('auth_token', data.data.token);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        logout();
        return;
      }

      const data: LoginResponse = await response.json();
      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.data.user));
      localStorage.setItem('auth_token', data.data.token);
    } catch (error) {
      console.error('Refresh failed:', error);
      logout();
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    refresh,
    setUser,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
