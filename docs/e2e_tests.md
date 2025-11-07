# E2E Тестирование AIBRO Business

## Обзор

End-to-End (E2E) тестирование AIBRO Business обеспечивает проверку полного пользовательского сценария, начиная от взаимодействия с интерфейсом и заканчивая взаимодействием с сервером. Для E2E тестирования используется Playwright - современный фреймворк, обеспечивающий надежное и быстрое тестирование.

## Стек E2E тестирования

### Playwright
- **Multi-browser support** - Поддержка Chrome, Firefox, Safari, Edge
- **Mobile testing** - Эмуляция мобильных устройств и сенсорных взаимодействий
- **Visual regression** - Проверка визуальных изменений
- **Network interception** - Перехват и мокирование сетевых запросов
- **Auto-waiting** - Автоматическое ожидание загрузки элементов
- **Parallel execution** - Параллельное выполнение тестов
- **Trace viewer** - Инструмент анализа выполнения тестов
- **Recording** - Автоматическая запись видео упавших тестов

## Структура E2E тестов

```
e2e/
├── fixtures/
│   ├── auth.setup.ts          # Установка аутентификации
│   ├── global.setup.ts        # Глобальные настройки
│   └── database.setup.ts      # Установка тестовой БД
├── models/
│   ├── pages/
│   │   ├── LoginPage.ts      # Модель страницы логина
│   │   ├── RegistrationPage.ts # Модель страницы регистрации
│   │   ├── ProductsPage.ts    # Модель страницы продуктов
│   │   ├── CartPage.ts        # Модель корзины
│   │   ├── AccountPage.ts     # Модель личного кабинета
│   │   └── ...
│   └── components/
│       ├── Header.ts          # Модель компонента хедера
│       ├── Footer.ts          # Модель компонента футера
│       ├── ProductCard.ts     # Модель карточки продукта
│       └── ...
├── specs/
│   ├── auth/
│   │   ├── login.e2e.ts
│   │   ├── registration.e2e.ts
│   │   ├── forgot-password.e2e.ts
│   │   └── logout.e2e.ts
│   ├── products/
│   │   ├── browse-products.e2e.ts
│   │   ├── product-details.e2e.ts
│   │   └── compare-products.e2e.ts
│   ├── cart/
│   │   ├── add-to-cart.e2e.ts
│   │   ├── update-quantity.e2e.ts
│   │   ├── remove-item.e2e.ts
│   │   └── checkout-flow.e2e.ts
│   ├── payments/
│   │   ├── crypto-payment.e2e.ts
│   │   ├── payment-status.e2e.ts
│   │   └── confirm-payment.e2e.ts
│   ├── user/
│   │   ├── profile-update.e2e.ts
│   │   ├── subscription-management.e2e.ts
│   │   └── payment-history.e2e.ts
│   ├── core/
│   │   ├── navigation.e2e.ts
│   │   ├── theme-switching.e2e.ts
│   │   └── language-switching.e2e.ts
│   └── scenarios/
│       ├── complete-purchase.e2e.ts
│       ├── free-trial.e2e.ts
│       └── contact-form.e2e.ts
├── utils/
│   ├── constants.ts           # Константы для тестов
│   ├── helpers.ts             # Вспомогательные функции
│   └── selectors.ts           # Селекторы элементов
├── data/
│   ├── test-users.json        # Тестовые пользователи
│   ├── test-products.json     # Тестовые продукты
│   └── ...
└── reports/
    ├── html/
    ├── junit/
    └── traces/
```

## Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  /* Параметры выполнения */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 8 : 4,
  
  /* Reporter для генерации отчетов */
  reporter: [
    ['html', { outputFolder: 'e2e/reports/html', open: 'never' }],
    ['junit', { outputFile: 'e2e/reports/junit/results.xml' }],
    ['list']
  ],
  
  use: {
    /* Базовый URL для действий */
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    /* Включение screenshot при падении */
    screenshot: 'only-on-failure',
    
    /* Включение trace при падении */
    trace: 'retain-on-failure',
    
    /* Видеозапись при падении */
    video: 'retain-on-failure',
    
    /* Таймауты */
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    /* Включение headless режима для CI */
    headless: process.env.CI === 'true',
  },

  /* Конфигурация проектов для разных браузеров и устройств */
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

    /* Мобильные устройства */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Запуск серверов перед тестами */
  webServer: {
    command: process.env.CI ? 'npm run build && npm run serve' : 'npm run dev',
    url: process.env.BASE_URL || 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Page Object Model (POM)

### Модель страницы логина (models/pages/LoginPage.ts):
```typescript
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth');
    await expect(this.page).toHaveURL(/.*auth/);
  }

  async isOnPage() {
    return await this.page.isVisible('[data-testid="login-form"]');
  }

  async fillCredentials(email: string, password: string) {
    await this.page.locator('[data-testid="email-input"]').fill(email);
    await this.page.locator('[data-testid="password-input"]').fill(password);
  }

  async clickSubmit() {
    await this.page.locator('button[type="submit"]').click();
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.clickSubmit();
  }

  async getErrorMessage() {
    const errorElement = this.page.locator('[data-testid="error-message"]');
    await expect(errorElement).toBeVisible();
    return await errorElement.textContent();
  }

  async waitForLoginRedirect() {
    await this.page.waitForURL('**/account');
  }

  async isLogged() {
    return await this.page.isVisible('[data-testid="user-menu"]');
  }
}
```

### Модель страницы продуктов (models/pages/ProductsPage.ts):
```typescript
import { Page, expect } from '@playwright/test';

export class ProductsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/products');
    await expect(this.page).toHaveURL(/.*products/);
  }

  async isOnPage() {
    return await this.page.isVisible('[data-testid="products-list"]');
  }

  async clickProduct(productName: string) {
    const productCard = this.page.locator(`[data-testid="product-card"]:has-text("${productName}")`);
    await expect(productCard).toBeVisible();
    await productCard.click();
  }

  async filterByTier(tier: number) {
    await this.page.locator(`[data-testid="filter-tier-${tier}"]`).click();
  }

  async sortByPrice(order: 'asc' | 'desc') {
    await this.page.locator(`[data-testid="sort-price-${order}"]`).click();
  }

  async getAvailableProducts() {
    const productCards = this.page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    const products = [];

    for (let i = 0; i < count; i++) {
      const name = await productCards.nth(i).locator('[data-testid="product-name"]').textContent();
      const price = await productCards.nth(i).locator('[data-testid="product-price"]').textContent();
      products.push({ name: name?.trim(), price: price?.trim() });
    }

    return products;
  }

  async addProductToCart(productName: string) {
    const productCard = this.page.locator(`[data-testid="product-card"]:has-text("${productName}")`);
    await expect(productCard).toBeVisible();
    
    const addToCartButton = productCard.locator('[data-testid="add-to-cart"]');
    await addToCartButton.click();
    
    // Wait for success indication
    await expect(
      this.page.locator('[data-testid="cart-added-success"]')
    ).toBeVisible();
  }

  async clickViewCart() {
    await this.page.locator('[data-testid="cart-icon"]').click();
  }
}
```

## Типичные E2E сценарии

### 1. Полный сценарий покупки:
```typescript
// specs/scenarios/complete-purchase.e2e.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/LoginPage';
import { ProductsPage } from '../../models/pages/ProductsPage';
import { CartPage } from '../../models/pages/CartPage';
import { PaymentPage } from '../../models/pages/PaymentPage';

test.describe('Complete Purchase Flow', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    paymentPage = new PaymentPage(page);
  });

  test('should complete purchase from product selection to payment', async ({ page }) => {
    // 1. Навигация и аутентификация
    await productsPage.goto();
    expect(await productsPage.isOnPage()).toBe(true);

    // 2. Выбор и добавление продукта в корзину
    await productsPage.addProductToCart('AI PostMaster');
    
    // 3. Переход к корзине
    await productsPage.clickViewCart();
    await expect(page).toHaveURL(/.*cart/);

    // 4. Проверка содержимого корзины
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThan(0);
    expect(cartItems.some(item => item.name.includes('AI PostMaster'))).toBe(true);

    // 5. Переход к оформлению заказа
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout/);

    // 6. Выбор способа оплаты
    await paymentPage.selectPaymentMethod('crypto');
    await paymentPage.selectCryptoCurrency('USDT');

    // 7. Подтверждение оплаты
    await paymentPage.confirmPayment();
    
    // 8. Проверка создания платежа
    await expect(page.locator('[data-testid="payment-created"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="amount"]')).toBeVisible();
  });

  test('should handle cart update and total calculation', async ({ page }) => {
    // Добавление нескольких продуктов
    await productsPage.goto();
    await productsPage.addProductToCart('AI PostMaster');
    await productsPage.addProductToCart('Conversation Bot');

    // Переход к корзине
    await productsPage.clickViewCart();
    
    // Проверка общего количества и суммы
    const totalAmount = await cartPage.getTotalAmount();
    const totalItems = await cartPage.getTotalItemsCount();
    
    expect(totalItems).toBe(2);
    expect(parseFloat(totalAmount.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);

    // Увеличение количества
    await cartPage.increaseQuantity('AI PostMaster');
    
    // Проверка обновленной суммы
    const updatedTotal = await cartPage.getTotalAmount();
    expect(parseFloat(updatedTotal.replace(/[^\d.]/g, ''))).toBeGreaterThan(parseFloat(totalAmount.replace(/[^\d.]/g, '')));
  });
});
```

### 2. Аутентификация и сценарии аккаунта:
```typescript
// specs/auth/login-register.e2e.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/LoginPage';
import { RegistrationPage } from '../../models/pages/RegistrationPage';
import { AccountPage } from '../../models/pages/AccountPage';

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    accountPage = new AccountPage(page);
  });

  test('should allow new user registration', async ({ page }) => {
    await registrationPage.goto();
    expect(await registrationPage.isOnPage()).toBe(true);

    await registrationPage.fillRegistrationForm({
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'Password123!',
      telegram: `@testuser${Date.now()}`
    });

    await registrationPage.acceptTerms();
    await registrationPage.submit();
    
    // Проверка успешной регистрации и редиректа
    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
  });

  test('should handle login with valid credentials', async ({ page }) => {
    await loginPage.goto();
    
    await loginPage.login('test@example.com', 'Password123!');
    
    // Ожидание редиректа
    await loginPage.waitForLoginRedirect();
    
    // Проверка успешной авторизации
    expect(await loginPage.isLogged()).toBe(true);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.goto();
    
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Неверные учетные данные');
  });

  test('should allow user to update profile information', async ({ page }) => {
    // Сначала авторизуемся
    await loginPage.goto();
    await loginPage.login('test@example.com', 'Password123!');
    await loginPage.waitForLoginRedirect();

    // Переход к профилю
    await accountPage.goto();
    
    const newName = 'Updated Name ' + Date.now();
    
    // Обновление информации
    await accountPage.updateProfile({
      name: newName
    });

    // Проверка обновления
    const updatedName = await accountPage.getProfileName();
    expect(updatedName).toBe(newName);
  });
});
```

## Mobile и адаптивное тестирование

### Мобильный сценарий:
```typescript
// specs/mobile/mobile-navigation.e2e.ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../models/pages/ProductsPage';

test.use({ ...devices['Pixel 5'] });

test.describe('Mobile Navigation', () => {
  test('should open mobile menu and navigate to products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    await page.goto('/');
    
    // Открытие мобильного меню
    await page.locator('[data-testid="mobile-menu-button"]').click();
    
    // Проверка отображения меню
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Переход к продуктам
    await page.locator('a:text("Продукты")').click();
    
    // Проверка загрузки страницы продуктов
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h1')).toContainText('Продукты');
  });

  test('should show mobile-friendly product cards', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    await productsPage.goto();
    
    // Проверка мобильной версии карточек
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    // Проверка адаптации элементов под мобильный экран
    await expect(productCards.first()).toHaveCSS('padding', '20px'); // Убедиться, что размеры под мобильные
    await expect(productCards.locator('button')).haveAttribute('data-testid', 'mobile-add-to-cart');
  });

  test('should open product details in mobile-friendly way', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    await productsPage.goto();
    
    // Клик по продукту для открытия деталей
    await productsPage.clickProduct('AI PostMaster');
    
    // Проверка мобильной версии деталей
    await expect(page.locator('[data-testid="mobile-product-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-buy-button"]')).toBeVisible();
  });
});
```

## Тестирование форм и валидаций

### Формы и валидации:
```typescript
// specs/forms/form-validation.e2e.ts
import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../models/pages/RegistrationPage';

test.describe('Form Validation', () => {
  test('should show validation errors for empty fields', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    await registrationPage.goto();
    
    // Отправка пустой формы
    await registrationPage.submit();
    
    // Проверка всех ошибок валидации
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email обязателен');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Минимум 8 символов');
    await expect(page.locator('[data-testid="name-error"]')).toContainText('Имя обязательно');
    await expect(page.locator('[data-testid="telegram-error"]')).toContainText('Неверный формат');
  });

  test('should validate email format', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    await registrationPage.goto();
    
    // Ввод неверного email
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="password-input"]').fill('Password123!');
    
    // Фокус с поля чтобы тригернуть валидацию
    await page.locator('button[type="submit"]').focus();
    
    // Проверка ошибки валидации
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Неверный формат email');
  });

  test('should validate password strength', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    await registrationPage.goto();
    
    // Ввод слабого пароля
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('weak');
    
    // Фокус с поля чтобы триггернуть валидацию
    await page.locator('button[type="submit"]').focus();
    
    // Проверка ошибок
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Минимум 8 символов');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Заглавная буква');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Цифра');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Спецсимвол');
  });

  test('should validate telegram username format', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    await registrationPage.goto();
    
    // Ввод неверного формата telegram
    await registrationPage.fillField('telegram', 'invalid_username_format');
    
    // Проверка ошибки
    await expect(page.locator('[data-testid="telegram-error"]')).toContainText('Неверный формат');
    
    // Проверка корректного формата
    await registrationPage.fillField('telegram', '@validusername');
    
    // Убедиться, что ошибки нет
    await expect(page.locator('[data-testid="telegram-error"]')).not.toBeVisible();
  });
});
```

## Мокирование API и сеть

### Network interception:
```typescript
// specs/api-mocking/api-mock.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('API Mocking', () => {
  test('should mock products API response', async ({ page }) => {
    // Мокирование API для получения продуктов
    await page.route('**/api/products', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            products: [
              { id: '1', name: 'Test Product', price: 990, description: 'Test product' },
              { id: '2', name: 'Another Product', price: 1990, description: 'Another test product' }
            ]
          }
        })
      });
    });

    await page.goto('/products');
    
    // Проверка, что мокированные данные отображаются
    await expect(page.locator('text="Test Product"')).toBeVisible();
    await expect(page.locator('text="Another Product"')).toBeVisible();
    await expect(page.locator('text="990₽"')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Мокирование ошибки сервера
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
          code: 'SERVER_ERROR'
        })
      });
    });

    await page.goto('/auth');
    
    // Попытка логина
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();
    
    // Проверка отображения сообщения об ошибке
    await expect(page.locator('text="Внутренняя ошибка сервера"')).toBeVisible();
  });

  test('should mock payment creation', async ({ page }) => {
    await page.route('**/api/payments/crypto/create', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            paymentId: 'test-payment-id',
            walletAddress: 'test-wallet-address',
            amountRub: 990,
            amountCrypto: 0.001,
            currency: 'USDT',
            qrCode: 'data:image/png;base64,...',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        })
      });
    });

    // Перейти к процессу оплаты и проверить создание мокированного платежа
    await page.goto('/cart/checkout');
    await page.locator('[data-testid="payment-method-crypto"]').click();
    await page.locator('[data-testid="crypto-usdt"]').click();
    
    await page.locator('[data-testid="confirm-payment"]').click();
    
    // Проверка успешного создания платежа
    await expect(page.locator('[data-testid="payment-created"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-address"]')).toHaveText('test-wallet-address');
  });

  test('should intercept and verify request data', async ({ page }) => {
    let interceptedRequest: any;

    // Перехват запроса
    await page.route('**/api/auth/register', async (route, request) => {
      interceptedRequest = request;
      await route.continue();
    });

    await page.goto('/auth');
    
    // Переключение на регистрацию
    await page.locator('button:text("Зарегистрироваться")').click();
    
    // Заполнение формы
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password123!');
    await page.locator('[data-testid="telegram-input"]').fill('@testuser');
    
    // Отправка формы
    await page.locator('button[type="submit"]').click();
    
    // Проверка данных запроса
    if (interceptedRequest) {
      const postData = JSON.parse(interceptedRequest.postData() || '{}');
      expect(postData.name).toBe('Test User');
      expect(postData.email).toBe('test@example.com');
      expect(postData.telegram).toBe('@testuser');
    }
  });
});
```

## Визуальное тестирование

### Visual regression:
```typescript
// specs/visual/visual-regression.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('should match design of homepage', async ({ page }) => {
    await page.goto('/');
    
    // Ожидание загрузки всех элементов
    await page.waitForSelector('[data-testid="hero-section"]');
    
    await expect(page).toHaveScreenshot('homepage.png', { 
      maxDiffPixelRatio: 0.02, // 2% допустимых различий
      fullPage: true
    });
  });

  test('should match design of products page', async ({ page }) => {
    await page.goto('/products');
    
    // Ожидание загрузки продуктов
    await page.waitForSelector('[data-testid="products-list"]');
    
    await expect(page).toHaveScreenshot('products-page.png', { 
      fullPage: true 
    });
  });

  test('should match design in dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Переключение на темную тему
    await page.locator('[data-testid="theme-toggle"]').click();
    
    // Ожидание применения темы
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', { 
      fullPage: true 
    });
  });

  test('should match mobile design', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only runs on mobile devices');

    await page.goto('/');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', { 
      fullPage: true 
    });
  });

  test('should match design of auth page', async ({ page }) => {
    await page.goto('/auth');
    
    await expect(page).toHaveScreenshot('auth-page.png');
  });

  test('should match design during loading states', async ({ page }) => {
    // Мокирование медленного API для проверки лоадинг состояния
    await page.route('**/api/products*', async (route) => {
      await page.waitForTimeout(2000); // Имитация задержки
      await route.fallback();
    });

    await page.goto('/products');
    
    // Сделать скриншот во время загрузки
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page).toHaveScreenshot('products-loading.png');
  });
});
```

## Тестирование производительности

### Performance Testing:
```typescript
// specs/performance/performance.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    const response = await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Проверка, что страница загружается быстро
    expect(loadTime).toBeLessThan(5000); // 5 секунд
    
    // Проверка времени ответа сервера
    const responseTime = response?.request().timing().responseStart;
    expect(responseTime).toBeLessThan(1000); // 1 секунда
  });

  test('should measure Largest Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    // Ожидание загрузки LCP
    const lcpPromise = page.evaluate(() => new Promise(resolve => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const largestEntry = entries.reduce((largest, entry) => 
          entry.startTime > largest.startTime ? entry : largest, 
          entries[0]
        );
        resolve(largestEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }));
    
    await page.waitForLoadState('networkidle');
    const lcp = await lcpPromise as number;
    
    // Проверка, что LCP быстрый
    expect(lcp).toBeLessThan(2500); // 2.5 секунды
  });

  test('should have acceptable TTFB', async ({ page }) => {
    await page.goto('/');
    
    // Проверка TTFB (Time to First Byte)
    const request = page.waitForEvent('requestfinished', req => req.url().includes('/'));
    const response = await request;
    const timing = response.timing();
    
    // TTFB должен быть быстрым
    expect(timing.responseStart).toBeLessThan(600); // 600мс
  });

  test('should handle multiple concurrent users', async ({ page }) => {
    // Простой тест на производительность с несколькими страницами
    const startTime = Date.now();
    
    // Открытие нескольких страниц одновременно
    const page1 = await page.context().newPage();
    const page2 = await page.context().newPage();
    
    await Promise.all([
      page.goto('/'),
      page1.goto('/products'),
      page2.goto('/auth')
    ]);
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(10000); // 10 секунд для 3 страниц
    
    await page1.close();
    await page2.close();
  });

  test('should have optimized resource loading', async ({ page }) => {
    const requests = [];
    page.on('request', req => {
      if (!req.url().includes('localhost')) return;
      requests.push({
        url: req.url(),
        method: req.method(),
        resourceType: req.resourceType()
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверка, что ресурсы загружаются оптимально
    const imageRequests = requests.filter(r => r.resourceType === 'image');
    const scriptRequests = requests.filter(r => r.resourceType === 'script');
    
    // Проверка WebP/AVIF изображений
    const webpImages = imageRequests.filter(r => r.url.includes('.webp'));
    const avifImages = imageRequests.filter(r => r.url.includes('.avif'));
    
    expect(webpImages.length + avifImages.length).toBeGreaterThan(0); // Должны быть оптимизированные изображения
    
    // Проверка сжатия JavaScript
    expect(scriptRequests.length).toBeLessThan(10); // Не должно быть слишком много JS файлов
  });
});
```

## Тестирование доступности

### Accessibility Testing:
```typescript
// specs/accessibility/accessibility.e2e.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have automatic accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test('should not have accessibility violations on auth page', async ({ page }) => {
    await page.goto('/auth');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations.length).toBeLessThan(3); // Максимум 3 незначительных нарушения
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/products');
    
    // Проверка, что на странице есть H1 заголовок
    const h1Elements = await page.$$('.h1, h1');
    expect(h1Elements.length).toBeGreaterThan(0);
    expect(h1Elements.length).toBeLessThan(3); // Не должно быть слишком много H1
    
    // Проверка, что H2 следуют за H1
    const h2Elements = await page.$$('.h2, h2');
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Проверка контраста через axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ 
        runOnly: {
          type: 'tag',
          values: ['color-contrast']
        }
      })
      .analyze();
    
    // Все нарушения контраста должны быть исправлены
    const colorContrastViolations = accessibilityScanResults.violations
      .filter(v => v.id === 'color-contrast');
    
    expect(colorContrastViolations.length).toBe(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Проверка клавиатурной навигации
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('A'); // Первый фокусируемый элемент - ссылка
    
    // Проверка, что фокус может перемещаться
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Проверка, что есть skip navigation link
    const skipLink = await page.locator('[data-testid="skip-nav"]');
    expect(skipLink).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/auth');
    
    // Проверка ARIA атрибутов
    const emailInput = await page.locator('[data-testid="email-input"]');
    const emailAriaLabel = await emailInput.getAttribute('aria-label');
    expect(emailAriaLabel).not.toBeNull();
    
    // Проверка ARIA описаний
    const passwordInput = await page.locator('[data-testid="password-input"]');
    const passwordAriaDescribedBy = await passwordInput.getAttribute('aria-describedby');
    if (passwordAriaDescribedBy) {
      const descriptionElement = await page.locator(`#${passwordAriaDescribedBy}`);
      expect(descriptionElement).toBeVisible();
    }
  });
});
```

## CI/CD Интеграция

### GitHub Actions Workflow:
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
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
        env:
          CI: true
          BASE_URL: ${{ secrets.E2E_BASE_URL }}
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
          
      - name: Upload test videos
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-videos
          path: e2e/videos/
          retention-days: 14
          
      - name: Upload test traces
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-traces
          path: e2e/traces/
          retention-days: 14

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run visual tests
        run: npm run test:visual
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: visual-screenshots
          path: e2e/screenshots/
          retention-days: 30
```

## Best Practices

### 1. Naming Convention
- Использование понятных имен для тестов
- Описание ожидаемого поведения
- Использование BDD стиль (Given/When/Then)
- Четкое разделение по функциональным областям

### 2. Page Object Model
- Единый источник истины для элементов страницы
- Повторное использование в нескольких тестах
- Поддержка читаемости и поддерживаемости
- Изоляция изменений в DOM от тестов

### 3. Test Data Management
- Использование тестовых данных из внешних источников
- Генерация уникальных данных для каждого теста
- Изоляция тестов друг от друга
- Очистка данных после тестов

### 4. Reliable Tests
- Использование явных ожиданий вместо sleep
- Проверка состояния элементов перед взаимодействием
- Избегание хрупких селекторов
- Обработка асинхронных операций корректно

### 5. Performance
- Параллельное выполнение тестов
- Использование shared fixtures для подготовки данных
- Избегание дублирования логики
- Оптимизация времени выполнения тестов

## Отчетность и мониторинг

### Built-in reporting
- HTML отчеты с трейсами выполнения
- JUnit XML для CI/CD интеграции
- Видеозаписи упавших тестов
- Скриншоты ошибок
- Trace viewer для отладки

### Показатели для мониторинга
- Процент пройденных тестов
- Время выполнения тестов
- Частота падений
- Время загрузки страниц в тестах
- Производительность ключевых сценариев

## Заключение

E2E тестирование в AIBRO Business обеспечивает высокое качество пользовательского опыта через:
- Тестирование полных пользовательских сценариев
- Проверку на разных устройствах и браузерах
- Визуальную регрессию
- Проверку доступности
- Тестирование производительности
- Обнаружение проблем на ранних этапах

Комплексный подход к E2E тестированию гарантирует, что приложение работает корректно в реальных условиях использования.