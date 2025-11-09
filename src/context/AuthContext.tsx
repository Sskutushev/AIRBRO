import React, {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { apiClient } from '../services/api/client';
import * as ApiTypes from '../types/api';

interface AuthContextType {
  user: ApiTypes.User | null;
  loading: boolean;
  setAuthData: (user: ApiTypes.User, token: string) => void;
  clearAuthData: () => void;
  setCurrentUser: (userData: ApiTypes.User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ApiTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for token and user data on initial load
  useEffect(() => {
    const token = localStorage.getItem('airbro_token');
    if (token) {
      apiClient.setToken(token);
      apiClient
        .getMe()
        .then((userData: ApiTypes.User) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
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

  const setAuthData = useCallback((user: ApiTypes.User, token: string) => {
    localStorage.setItem('airbro_token', token);
    apiClient.setToken(token);
    setUser(user);
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    localStorage.removeItem('airbro_token');
    apiClient.setToken(null);
  }, []);

  const setCurrentUser = useCallback((userData: ApiTypes.User | null) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('airbro_token');
    apiClient.setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setAuthData,
      clearAuthData,
      setCurrentUser,
      logout,
    }),
    [user, loading, setAuthData, clearAuthData, setCurrentUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
