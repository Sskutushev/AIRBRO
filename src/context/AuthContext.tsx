import React, { createContext, useContext, type ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import * as ApiTypes from '../types/api';

interface AuthContextType {
  user: ApiTypes.User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, telegram: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<ApiTypes.User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ApiTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверяем наличие токена и пользователя при загрузке
  useEffect(() => {
    const token = localStorage.getItem('airbro_token');
    if (token) {
      // Проверяем валидность токена, запросив данные пользователя
      apiClient.setToken(token);
      apiClient.getMe()
      .then((userData: ApiTypes.User) => {
        setUser(userData);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Если токен невалиден, удаляем его
        localStorage.removeItem('airbro_token');
        apiClient.setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiClient.login(email, password);
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('airbro_token', data.token);
      apiClient.setToken(data.token);
      setUser(data.user as ApiTypes.User);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, telegram: string) => {
    setLoading(true);
    try {
      const data = await apiClient.register({ name, email, password, telegram });
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('airbro_token', data.token);
      apiClient.setToken(data.token);
      setUser(data.user as ApiTypes.User);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('airbro_token');
    apiClient.setToken(null);
    localStorage.removeItem('airbro_user');
  }, []);

  const updateUser = useCallback((userData: Partial<ApiTypes.User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData } as ApiTypes.User;
      setUser(updatedUser);
      localStorage.removeItem('airbro_user'); // Remove old user data from local storage
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  }), [user, loading, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};