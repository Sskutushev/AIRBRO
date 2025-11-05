import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setSuccess(false);
      await login(email, password);
      setSuccess(true);
    } catch (err) {
      setError('Ошибка входа. Пожалуйста, проверьте данные и попробуйте снова.');
      console.error('Login error:', err);
    }
  };

  return { handleLogin, loading, error, success };
};