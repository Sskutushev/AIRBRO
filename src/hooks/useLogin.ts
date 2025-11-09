import { useState } from 'react';
import { apiClient, APIError } from '../services/api/client';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      localStorage.setItem('token', response.token);
      return response.user;
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
