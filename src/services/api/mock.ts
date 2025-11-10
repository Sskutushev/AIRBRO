// Mock API для тестирования фронтенда
// Этот файл можно использовать для имитации ответов бэкенда

const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    telegram: '@testuser',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

const mockProducts = [
  {
    id: '1',
    slug: 'basic-plan',
    name: 'Базовый план',
    description: 'Основные функции для начинающих',
    price: 999,
    interval: 'month',
    features: JSON.stringify(['Автоматизация', 'Аналитика', 'Поддержка']),
    isActive: true,
    tier: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockAPI = {
  // Auth endpoints
  async login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    const user = mockUsers[0];
    return {
      user,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  async register(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      telegram: data.telegram || '',
      createdAt: new Date().toISOString(),
    };

    return {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  async getMe() {
    return mockUsers[0];
  },

  // Products endpoints
  async getProducts() {
    return mockProducts;
  },

  async getProductBySlug(slug: string) {
    return mockProducts.find((p) => p.slug === slug) || mockProducts[0];
  },

  // Cart endpoints
  async getCart() {
    return [];
  },

  async addToCart(productId: string, quantity: number = 1) {
    const product = mockProducts.find((p) => p.id === productId);
    return {
      id: Date.now().toString(),
      quantity,
      product: product || mockProducts[0],
    };
  },
};
