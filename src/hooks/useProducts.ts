/**
 * @file Custom hooks for fetching product-related data using TanStack Query.
 * @module hooks/useProducts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, APIError } from '../services/api/client';
import { showToast } from '../lib/toast';

// --- Type Definitions (should ideally come from a central types file) ---
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string; // JSON string
  isActive: boolean;
  tier: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

/**
 * Hook to fetch a list of products.
 * @param {object} [params] - Optional parameters for filtering products.
 * @param {number} [params.tier] - Filter by product tier.
 * @param {boolean} [params.isActive] - Filter by active status.
 * @returns {object} TanStack Query result object.
 */
export function useProducts(params?: { tier?: number; isActive?: boolean }) {
  return useQuery<Product[], APIError>({
    queryKey: ['products', params],
    queryFn: () => apiClient.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single product by its slug.
 * @param {string} slug - The unique slug of the product.
 * @returns {object} TanStack Query result object.
 */
export function useProduct(slug: string) {
  return useQuery<Product, APIError>({
    queryKey: ['product', slug],
    queryFn: () => apiClient.getProductBySlug(slug),
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to add a product to the user's cart.
 * @returns {object} TanStack Query mutation result object.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<CartItem, APIError, { productId: string; quantity?: number }>({
    mutationFn: ({ productId, quantity = 1 }) => apiClient.addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Invalidate cart query to refetch
      showToast.success(`"${data.product.name}" добавлен в корзину.`);
    },
    onError: (error) => {
      showToast.error(error.message || 'Не удалось добавить товар в корзину.');
    },
  });
}

/**
 * Hook to remove a product from the user's cart.
 * @returns {object} TanStack Query mutation result object.
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation<void, APIError, string>({
    mutationFn: (productId) => apiClient.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Invalidate cart query to refetch
      showToast.success('Товар удален из корзины.');
    },
    onError: (error) => {
      showToast.error(error.message || 'Не удалось удалить товар из корзины.');
    },
  });
}

/**
 * Hook to clear the entire user's cart.
 * @returns {object} TanStack Query mutation result object.
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation<void, APIError>({
    mutationFn: () => apiClient.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Invalidate cart query to refetch
      showToast.success('Корзина очищена.');
    },
    onError: (error) => {
      showToast.error(error.message || 'Не удалось очистить корзину.');
    },
  });
}
