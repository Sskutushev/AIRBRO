import React, { createContext, useContext, type ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  telegram: string;
  subscriptions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, telegram: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверяем наличие пользователя в localStorage при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem('airbro_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации создадим фиктивного пользователя
    setLoading(true);
    
    // Имитация API-запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_123',
      name: 'Иван Иванов',
      email,
      telegram: '@ivan_ivanov',
      subscriptions: ['ai_postmaster', 'conversation_bot']
    };
    
    setUser(mockUser);
    localStorage.setItem('airbro_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const register = async (name: string, email: string, telegram: string) => {
    setLoading(true);
    
    // Имитация API-запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'user_456',
      name,
      email,
      telegram,
      subscriptions: [] // Новый пользователь без подписок
    };
    
    setUser(mockUser);
    localStorage.setItem('airbro_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('airbro_user');
    localStorage.removeItem('airbro_token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('airbro_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

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