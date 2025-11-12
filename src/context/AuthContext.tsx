import React, {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { apiClient } from '../services/api/client';
import { storage } from '../lib/utils/storage';
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
  const mountedRef = useRef(true);

  // Check for token and user data on initial load
  useEffect(() => {
    // Update mounted ref when component mounts/unmounts
    mountedRef.current = true;

    const token = storage.get<string>('authToken');
    if (token) {
      apiClient.setToken(token);
      apiClient
        .getMe()
        .then((userData: ApiTypes.User) => {
          if (mountedRef.current) {
            setUser(userData);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          if (mountedRef.current) {
            storage.remove('authToken');
            apiClient.setToken(null);
          }
        })
        .finally(() => {
          if (mountedRef.current) {
            setLoading(false);
          }
        });
    } else {
      if (mountedRef.current) {
        setLoading(false);
      }
    }

    // Cleanup function to mark component as unmounted
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setAuthData = useCallback((user: ApiTypes.User, token: string) => {
    storage.set<string>('authToken', token);
    apiClient.setToken(token);
    setUser(user);
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    storage.remove('authToken');
    apiClient.setToken(null);
  }, []);

  const setCurrentUser = useCallback((userData: ApiTypes.User | null) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove('authToken');
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
