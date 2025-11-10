/**
 * @file Custom React Query hooks for authentication-related API calls.
 * @module hooks/useAuth
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type APIError } from '../services/api/client';
import { showToast } from '../lib/toast';
import { useAuth } from '../context/AuthContext';
import { type LoginInput, type RegisterInput } from '../lib/validation/auth';

export function useLogin() {
  const { setAuthData } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      setAuthData(data.user, data.token);
      showToast.success('Успешный вход');
    },
    onError: (error: APIError) => {
      console.error('Login error:', error);
      showToast.error(error.message || 'Ошибка при входе');
    },
  });
}

export function useRegister() {
  const { setAuthData } = useAuth();

  return useMutation({
    mutationFn: (userData: RegisterInput) => {
      // Create a copy of userData without confirmPassword and agreement to send to server
      const { confirmPassword, agreement, ...apiData } = userData;
      return apiClient.register(apiData);
    },
    onSuccess: (data) => {
      setAuthData(data.user, data.token);
      showToast.success('Регистрация успешна');
    },
    onError: (error: APIError) => {
      console.error('Registration error:', error);
      showToast.error(error.message || 'Ошибка при регистрации');
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuthData } = useAuth();

  return useMutation({
    mutationFn: () => {
      // In a real implementation, you might call an API endpoint to invalidate the session
      // For now, we just clear the local state
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      clearAuthData();
      queryClient.clear(); // Clears all query cache
      showToast.success('Выход выполнен');
    },
    onError: (error: APIError) => {
      console.error('Logout error:', error);
      showToast.error(error.message || 'Ошибка при выходе');
    },
  });
}
