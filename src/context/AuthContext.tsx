import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const token = localStorage.getItem('restaurant_token');
    if (token) {
      // In a real app, you would validate the token with your API
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@restaurant.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
      };
      setUser(mockUser);
      console.log("AuthProvider: sessão encontrada, usuário autenticado", mockUser);
    } else {
      console.log("AuthProvider: nenhuma sessão encontrada");
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login validation
      if (email === 'admin@restaurant.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@restaurant.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
        };
        setUser(mockUser);
        localStorage.setItem('restaurant_token', 'mock_token');
        console.log("AuthProvider: login admin realizado", mockUser);
      } else if (email === 'garcom@restaurant.com' && password === 'garcom123') {
        const mockUser: User = {
          id: '2',
          name: 'Garçom Silva',
          email: 'garcom@restaurant.com',
          role: 'waiter',
          isActive: true,
          createdAt: new Date(),
        };
        setUser(mockUser);
        localStorage.setItem('restaurant_token', 'mock_token');
        console.log("AuthProvider: login garçom realizado", mockUser);
      } else {
        console.log("AuthProvider: login falhou");
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_token');
    console.log("AuthProvider: logout realizado");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};