# Тестирование AIBRO Business

## Обзор стратегии тестирования

Проект AIBRO Business использует многоуровневую стратегию тестирования, охватывающую все аспекты приложения - от unit тестов до end-to-end тестов. Стратегия основана на принципах TDD и BDD с акцентом на покрытие критического функционала.

## Стек тестирования

### Frontend
- **Vitest** - быстрый и легкий тестовый фреймворк
- **React Testing Library** - для тестирования компонентов
- **React Hook Testing Library** - для тестирования хуков
- **Jest Matchers** - через Vitest для assertions
- **MSW (Mock Service Worker)** - для мокирования API
- **Testing Library Utilities** - screen, waitFor, fireEvent, etc.

### Backend
- **Vitest** - для unit тестирования
- **Supertest** - для интеграционного тестирования API
- **Jest Matchers** - через Vitest
- **Prisma Testing** - для тестирования взаимодействия с БД

### E2E
- **Playwright** - для сквозного тестирования
- **Multi-browser** - Chrome, Firefox, Safari, Edge
- **Mobile emulation** - тестирование на мобильных устройствах
- **Visual regression** - проверка регрессии интерфейса

## Структура тестов

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       ├── Button.test.tsx
│   │       └── ...
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   └── __tests__/
│   │       ├── HeroSection.test.tsx
│   │       └── ...
├── hooks/
│   ├── useAsync.ts
│   ├── useDebounce.ts
│   └── __tests__/
│       ├── useAsync.test.ts
│       ├── useDebounce.test.ts
│       └── ...
├── lib/
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── storage.ts
│   │   └── __tests__/
│   │       ├── validators.test.ts
│   │       ├── storage.test.ts
│   │       └── ...
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   └── __tests__/
│   │       ├── client.test.ts
│   │       └── ...
├── test/
│   ├── setup.ts          # Общая настройка тестов
│   ├── mocks/            # Моки
│   │   ├── handlers.ts   # MSW handlers
│   │   └── server.ts     # MSW server
│   └── helpers/          # Вспомогательные функции
│       ├── render.ts     # Вспомогательная функция render
│       └── ...
└── __tests__/            # Интеграционные тесты
    ├── pages/
    │   ├── HomePage.test.tsx
    │   └── ...
    └── ...
```

## Unit тестирование

### Тестирование компонентов

#### Пример теста компонента кнопки:
```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { container } = render(
      <Button variant="gradient-primary">Click me</Button>
    );
    
    expect(container.firstChild).toHaveClass('bg-gradient-to-r', 'from-primary-telegram', 'to-primary-electric');
  });

  it('applies correct size classes', () => {
    const { container } = render(
      <Button size="xl">Click me</Button>
    );
    
    expect(container.firstChild).toHaveClass('text-lg', 'px-8', 'py-4');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('shows loading state', () => {
    const { container } = render(<Button loading>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    
    // Проверка присутствия спиннера
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
```

### Тестирование хуков

#### useAsync hook тест:
```typescript
// hooks/__tests__/useAsync.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync Hook', () => {
  it('should have initial state', () => {
    const { result } = renderHook(() => useAsync<string>());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('should handle successful promise execution', async () => {
    const mockData = 'test data';
    const mockPromise = Promise.resolve(mockData);
    
    const { result } = renderHook(() => useAsync<string>());

    // Выполнение промиса
    result.current.execute(mockPromise);

    // Проверка состояния загрузки
    expect(result.current.loading).toBe(true);
    
    // Ожидание завершения
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(mockData);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle failed promise execution', async () => {
    const mockError = new Error('Test error');
    const mockPromise = Promise.reject(mockError);
    
    const { result } = renderHook(() => useAsync<string>());

    // Выполнение промиса
    await expect(result.current.execute(mockPromise)).rejects.toThrow('Test error');
    
    // Ожидание установки ошибки
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeNull();
    });
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useAsync<string>());
    
    // Установить состояние
    result.current.setData('test');
    result.current.setError(new Error('test error'));
    
    // Проверить, что состояние установлено
    expect(result.current.data).toBe('test');
    expect(result.current.error).toEqual(new Error('test error'));
    
    // Сбросить состояние
    result.current.reset();
    
    // Проверить, что состояние сброшено
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
```

### Тестирование утилит

#### Валидация тест:
```typescript
// lib/__tests__/utils/validators.test.ts
import { 
  isValidEmail, 
  isValidTelegram, 
  isStrongPassword, 
  validatePhoneNumber 
} from '../../lib/utils/validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidTelegram', () => {
    it('should validate correct telegram username', () => {
      expect(isValidTelegram('@username')).toBe(true);
      expect(isValidTelegram('@user_name123')).toBe(true);
    });

    it('should reject invalid telegram username', () => {
      expect(isValidTelegram('username')).toBe(false); // missing @
      expect(isValidTelegram('@usr')).toBe(false); // too short
      expect(isValidTelegram('@user-name')).toBe(false); // invalid character
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong password', () => {
      expect(isStrongPassword('Password123!')).toBe(true);
      expect(isStrongPassword('Str0ng@Pass')).toBe(true);
    });

    it('should reject weak password', () => {
      expect(isStrongPassword('short')).toBe(false); // too short
      expect(isStrongPassword('alllowercase123!')).toBe(false); // no uppercase
      expect(isStrongPassword('ALLUPPERCASE123!')).toBe(false); // no lowercase
      expect(isStrongPassword('NoNumbers!')).toBe(false); // no numbers
      expect(isStrongPassword('NoSpecial123')).toBe(false); // no special char
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone number', () => {
      expect(validatePhoneNumber('+79991234567')).toBe(true);
      expect(validatePhoneNumber('79991234567')).toBe(true);
    });

    it('should reject invalid phone number', () => {
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('short')).toBe(false);
      expect(validatePhoneNumber('letters123')).toBe(false);
    });
  });
});
```

### Тестирование API сервиса
```typescript
// services/__tests__/api/client.test.ts
import { apiClient, APIError } from '../../services/api/client';

// Mock fetch
global.fetch = vi.fn();

describe('APIClient', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('login', () => {
    it('should make successful login request', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'test-jwt-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.login('test@example.com', 'password123');
      
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });

    it('should throw APIError on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      await expect(
        apiClient.login('test@example.com', 'wrong-password')
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.login('test@example.com', 'wrong-password')
      ).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });
  });

  describe('getProducts', () => {
    it('should make successful getProducts request', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 990 },
        { id: '2', name: 'Product 2', price: 1990 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: mockProducts }),
      } as Response);

      const result = await apiClient.getProducts();
      
      expect(result).toEqual({ products: mockProducts });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should include query parameters when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [] }),
      } as Response);

      await apiClient.getProducts({ tier: 1, isActive: true });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/products\?.*tier=1.*isActive=true/),
        expect.any(Object)
      );
    });
  });

  describe('addToCart', () => {
    it('should make successful addToCart request', async () => {
      const productId = 'test-product-id';
      const quantity = 2;
      const mockCartItem = { id: 'cart-item-1', productId, quantity };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cartItem: mockCartItem }),
      } as Response);

      const result = await apiClient.addToCart(productId, quantity);
      
      expect(result).toEqual({ cartItem: mockCartItem });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/add'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ productId, quantity }),
        })
      );
    });

    it('should include auth token when available', async () => {
      apiClient.setToken('test-token');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cartItem: { id: '1' } }),
      } as Response);

      await apiClient.addToCart('test-product', 1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(
        apiClient.getProducts()
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.getProducts()
      ).rejects.toMatchObject({
        message: 'Connection error with server',
        statusCode: 0,
      });
    });

    it('should handle server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      } as Response);

      await expect(
        apiClient.getProducts()
      ).rejects.toThrow(APIError);

      await expect(
        apiClient.getProducts()
      ).rejects.toMatchObject({
        message: 'Internal server error',
        statusCode: 500,
      });
    });
  });
});
```

## Integration тесты

### Тестирование страниц
```typescript
// pages/__tests__/AccountPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AccountPage from '../AccountPage';

// Mock API client
vi.mock('../../services/api/client', () => ({
  apiClient: {
    getUserSubscriptions: vi.fn().mockResolvedValue({
      data: {
        subscriptions: [
          { id: 'sub-1', productId: 'prod-1', status: 'active' },
        ],
      },
    }),
    getUserProfile: vi.fn().mockResolvedValue({
      data: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
    }),
  },
}));

describe('AccountPage', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    telegram: '@testuser',
  };

  const renderWithAuth = (user: any) => {
    return render(
      <MemoryRouter>
        <AuthProvider value={{ user, loading: false, login: vi.fn(), logout: vi.fn() }}>
          <AccountPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders user profile information when authenticated', async () => {
    renderWithAuth(mockUser);

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('shows unauthorized message when not logged in', () => {
    renderWithAuth(null);

    expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
    expect(screen.getByText('Пожалуйста, войдите в свой аккаунт')).toBeInTheDocument();
  });

  it('fetches and displays user subscriptions', async () => {
    renderWithAuth(mockUser);

    await waitFor(() => {
      expect(screen.getByText('sub-1')).toBeInTheDocument();
    });
  });
});
```

## E2E тестирование (Playwright)

### Структура E2E тестов:
```
e2e/
├── fixtures/
│   ├── auth.setup.ts         # Установка аутентификации
│   └── global.setup.ts       # Глобальные настройки
├── models/
│   ├── pages/
│   │   ├── LoginPage.ts     # Модель страницы логина
│   │   ├── ProductsPage.ts  # Модель страницы продуктов
│   │   └── ...
├── specs/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── registration.spec.ts
│   ├── products/
│   │   └── browse-products.spec.ts
│   └── ...
├── utils/
│   ├── helpers.ts
│   └── selectors.ts
└── reports/                 # Отчеты о тестах
```

#### Пример E2E теста:
```typescript
// e2e/specs/auth/login.e2e.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/LoginPage';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should allow user to login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.login('test@example.com', 'Password123!');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/account');
    await expect(page.locator('[data-testid="user-welcome"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid credentials');
  });

  test('should validate form inputs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Try to login with empty fields
    await loginPage.clickSubmit();
    
    // Verify validation errors
    await expect(page.locator('text="Email обязателен"')).toBeVisible();
    await expect(page.locator('text="Пароль обязателен"')).toBeVisible();
  });
});

// e2e/models/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.locator('[data-testid="email-input"]').fill(email);
    await this.page.locator('[data-testid="password-input"]').fill(password);
    await this.page.locator('[data-testid="submit-button"]').click();
  }

  async clickSubmit() {
    await this.page.locator('[data-testid="submit-button"]').click();
  }
}
```

### Playwright конфигурация (playwright.config.ts):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list']
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Тестирование API (Backend)

### Unit тесты для контроллеров:
```typescript
// backend/src/controllers/__tests__/authController.test.ts
import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  // Очистка базы данных перед каждым тестом
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        telegram: '@testuser',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        telegram: '@testuser',
      });
      expect(response.body.data.token).toBeDefined();
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: 'Te', // Слишком короткое имя
        email: 'invalid-email',
        password: 'weak', // Слабый пароль
        telegram: 'invalid-username', // Неверный формат
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return error when email already exists', async () => {
      // Сначала зарегистрируем пользователя
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'unique@example.com',
          password: 'Password123!',
          telegram: '@testuser1',
        })
        .expect(201);

      // Попробуем зарегистрировать с тем же email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'unique@example.com',
          password: 'Password123!',
          telegram: '@testuser2',
        })
        .expect(409);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user with valid credentials', async () => {
      // Сначала зарегистрируем пользователя
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'login@example.com',
          password: 'Password123!',
          telegram: '@loginuser',
        })
        .expect(201);

      // Затем попробуем залогиниться
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('login@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
```

## Тестирование безопасности

### XSS тесты:
```typescript
// components/__tests__/SafeHTML.test.tsx
import { render, screen } from '@testing-library/react';
import { SafeHTML } from '../common/SafeHTML';
import DOMPurify from 'dompurify';

describe('SafeHTML Component', () => {
  it('should sanitize malicious scripts', () => {
    const maliciousHTML = '<p>Safe content</p><script>alert("XSS")</script>';
    
    render(<SafeHTML html={maliciousHTML} />);
    
    // Verify that script tag was removed
    expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
    // Verify that safe content remains
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('should allow safe tags', () => {
    const safeHTML = '<p>Safe paragraph</p><strong>Strong text</strong>';
    
    render(<SafeHTML html={safeHTML} />);
    
    expect(screen.getByText('Safe paragraph')).toBeInTheDocument();
    expect(screen.getByText('Strong text')).toBeInTheDocument();
  });

  it('should sanitize HTML according to configuration', () => {
    const htmlWithDisallowedTags = '<p>Good</p><script>Bad</script><iframe>Bad</iframe>';
    
    render(<SafeHTML html={htmlWithDisallowedTags} />);
    
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.queryByTag('script')).not.toBeInTheDocument();
    expect(screen.queryByTag('iframe')).not.toBeInTheDocument();
  });
});
```

## Покрытие кода

### Цели покрытия:
- **Общий уровень**: >70%
- **Компоненты**: >80%
- **Утилиты**: >90%
- **Хуки**: >85%
- **API клиент**: >80%

### Конфигурация покрытия (vitest.config.ts):
```typescript
export default defineConfig({
  // ... другие настройки
  test: {
    // ... другие настройки
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/',
        'src/**/*.test.*',
        'src/**/*.spec.*',
        'src/**/*.stories.*',
        'src/types/',
        'src/styles/',
        'src/assets/',
        'src/public/',
        'src/i18n/',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
```

## Continuous Testing

### GitHub Actions для тестирования:
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --ci --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level moderate

      - name: Run CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

## Best Practices

### Naming Convention:
- Имена тестов описывают поведение/ожидаемый результат
- Использование Given-When-Then структуры
- Один тест - одна проверка

### Организация тестов:
- Использование describe/it для логической группировки
- Четкая иерархия тестов
- Понятные имена тестов
- Чистый setup/teardown

### Тестирование компонентов:
- Тестирование пользовательских взаимодействий
- Проверка состояния компонентов
- Accessibility тестирование
- Responsive тестирование

### Мокирование:
- Использование моков для изоляции компонентов
- Мокирование API вызовов с помощью MSW
- Мокирование внешних зависимостей
- Управление состоянием моков

### Тестирование бизнес-логики:
- Unit тесты для бизнес-логики
- Тестирование граничных условий
- Тестирование обработки ошибок
- Тестирование валидаций

---

## Заключение

Система тестирования AIBRO Business обеспечивает высокое качество кода за счет:
- Комплексного покрытия функциональности
- Многоуровневого подхода к тестированию
- Автоматизированной проверки в CI/CD
- Следования лучшим практикам тестирования
- Регулярного мониторинга покрытия кода