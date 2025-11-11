/**
 * @file Custom React Query hooks for authentication-related API calls.
 * @module hooks/useAuth
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type APIError } from '../services/api/client';
import { showToast } from '../lib/toast';
import { useAuth } from '../context/AuthContext';
import { type LoginInput, type RegisterInput } from '../lib/validation/auth';

/**
 * @function useLogin
 * @description Custom hook for handling user login.
 * @returns {object} A mutation object from react-query for login operations.
 */
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

/**
 * @function useRegister
 * @description Custom hook for handling user registration.
 * @returns {object} A mutation object from react-query for registration operations.
 */
export function useRegister() {
  const { setAuthData } = useAuth();

  return useMutation({
    mutationFn: (userData: RegisterInput) => {
      // Create a copy of userData without confirmPassword and agreement to send to server
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _confirmPassword, agreement: _agreement, ...apiData } = userData;
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

/**
 * @function useProfile
 * @description Custom hook for fetching the current user's profile.
 * @returns {object} A query object from react-query for fetching user profile.
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * @function useLogout
 * @description Custom hook for handling user logout.
 * @returns {object} A mutation object from react-query for logout operations.
 */
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
