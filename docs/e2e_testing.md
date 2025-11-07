# E2E Тестирование AIBRO Business

## Обзор

End-to-End (E2E) тестирование проекта AIBRO Business обеспечивает проверку полного пользовательского сценария, начиная от взаимодействия с интерфейсом и заканчивая взаимодействием с сервером. Для E2E тестирования используется Playwright - современный фреймворк, обеспечивающий надежное и быстрое тестирование.

## Стек E2E тестирования

### Playwright
- **Multi-browser support** - Поддержка Chrome, Firefox, Safari, Edge
- **Mobile testing** - Эмуляция мобильных устройств и сенсорных взаимодействий
- **Visual regression** - Проверка визуальных изменений
- **Network interception** - Перехват и мокирование сетевых запросов
- **Auto-waiting** - Автоматическое ожидание элементов
- **Parallel execution** - Параллельное выполнение тестов
- **Trace viewer** - Инструмент анализа выполнения тестов
- **Recording** - Автоматическая запись видео упавших тестов

## Структура E2E тестов

```
e2e/
├── fixtures/
│   ├── auth.setup.ts          # Установка аутентификации
│   └── global.setup.ts        # Глобальные настройки
├── models/
│   ├── pages/
│   │   ├── LoginPage.ts      # Модель страницы логина
│   │   ├── RegistrationPage.ts # Модель страницы регистрации
│   │   ├── ProductsPage.ts    # Модель страницы продуктов
│   │   ├── CartPage.ts        # Модель корзины
│   │   ├── AccountPage.ts     # Модель аккаунта
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

## Page Object Model

### Модель страницы логина:
```typescript
// e2e/models/pages/LoginPage.ts
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Определение селекторов элементов
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.registerLink = page.locator('text="Зарегистрироваться"');
    this.forgotPasswordLink = page.locator('text="Забыли пароль?"');
  }

  async goto() {
    await this.page.goto('/auth');
    await this.page.waitForURL('**/auth');
  }

  async isOnPage() {
    return await this.page.isVisible('[data-testid="login-form"]');
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.clickSubmit();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }

  async waitForLoginRedirect(timeout: number = 10000) {
    await this.page.waitForURL('**/account', { timeout });
  }

  async isLoggedIn() {
    return await this.page.locator('[data-testid="user-menu"]').isVisible();
  }
}
```

### Модель страницы продуктов:
```typescript
// e2e/models/pages/ProductsPage.ts
import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsGrid: Locator;
  readonly productCards: Locator;
  readonly filterTierButtons: Locator;
  readonly sortBySelect: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsGrid = page.locator('[data-testid="products-grid"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.filterTierButtons = page.locator('[data-testid="filter-tier"]');
    this.sortBySelect = page.locator('[data-testid="sort-select"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
  }

  async goto() {
    await this.page.goto('/products');
    await this.page.waitForURL('**/products');
  }

  async isOnPage() {
    return await this.productsGrid.isVisible();
  }

  async clickProductByName(productName: string) {
    const productCard = this.productCards.filter({ hasText: productName });
    await productCard.locator('[data-testid="product-link"]').click();
  }

  async filterByTier(tier: number) {
    const filterButton = this.filterTierButtons.filter({ hasText: `Tier ${tier}` });
    await filterButton.click();
  }

  async sortBy(option: 'price_asc' | 'price_desc') {
    await this.sortBySelect.selectOption(option);
  }

  async searchProducts(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getAvailableProducts(): Promise<{ name: string; price: string; status: string }[]> {
    const productCount = await this.productCards.count();
    const products = [];

    for (let i = 0; i < productCount; i++) {
      const productCard = this.productCards.nth(i);
      const name = await productCard.locator('[data-testid="product-name"]').textContent();
      const price = await productCard.locator('[data-testid="product-price"]').textContent();
      const status = await productCard.locator('[data-testid="product-status"]').textContent();
      
      products.push({ 
        name: name?.trim() || '', 
        price: price?.trim() || '', 
        status: status?.trim() || '' 
      });
    }

    return products;
  }

  async addProductToCart(productName: string) {
    const productCard = this.productCards.filter({ hasText: productName });
    const addToCartButton = productCard.locator('[data-testid="add-to-cart"]');
    
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();
    
    // Ждем появление уведомления об успешном добавлении
    await this.page.locator('[data-testid="cart-added-notification"]').waitFor({ state: 'visible' });
  }
}
```

## Типичные E2E сценарии

### 1. Полный сценарий покупки:
```typescript
// e2e/specs/scenarios/complete-purchase.e2e.ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../models/pages/ProductsPage';
import { CartPage } from '../../models/pages/CartPage';
import { PaymentPage } from '../../models/pages/PaymentPage';
import { LoginPage } from '../../models/pages/LoginPage';

test.describe('Complete Purchase Flow', () => {
  test('should complete purchase from product selection to payment', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const paymentPage = new PaymentPage(page);

    // 1. Навигация к продуктам
    await productsPage.goto();
    expect(await productsPage.isOnPage()).toBe(true);

    // 2. Выбор и добавление продукта в корзину
    await productsPage.addProductToCart('AI PostMaster Premium');
    
    // 3. Переход к корзине
    await page.click('[data-testid="cart-icon"]');
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
    await expect(page.locator('[data-testid="payment-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-amount"]')).toBeVisible();
  });

  test('should handle cart operations correctly', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Добавление нескольких продуктов
    await productsPage.goto();
    await productsPage.addProductToCart('AI PostMaster Starter');
    await productsPage.addProductToCart('AI PostMaster Pro');

    // Переход к корзине
    await page.click('[data-testid="cart-icon"]');
    
    // Проверка содержимого
    const itemsCount = await cartPage.getItemCount();
    expect(itemsCount).toBe(2);

    // Изменение количества
    await cartPage.increaseQuantity('AI PostMaster Starter');
    const updatedItems = await cartPage.getItems();
    const starterItem = updatedItems.find(item => item.name.includes('AI PostMaster Starter'));
    expect(starterItem?.quantity).toBe(2);

    // Обновление итоговой суммы
    const totalPrice = await cartPage.getTotalPrice();
    expect(parseFloat(totalPrice.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);
  });
});
```

### 2. Сценарий аутентификации:
```typescript
// e2e/specs/auth/auth-flow.e2e.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/LoginPage';
import { RegistrationPage } from '../../models/pages/RegistrationPage';
import { AccountPage } from '../../models/pages/AccountPage';

test.describe('Authentication Flow', () => {
  test('should allow new user registration', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    await registrationPage.goto();
    expect(await registrationPage.isOnPage()).toBe(true);

    // Генерация уникальных данных для теста
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const uniqueTelegram = `@testuser${Date.now()}`;
    
    await registrationPage.register({
      name: 'Test User',
      email: uniqueEmail,
      password: 'Password123!',
      telegram: uniqueTelegram
    });

    // Проверка успешной регистрации и редиректа
    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
  });

  test('should handle login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('test@example.com', 'Password123!');
    
    // Ожидание редиректа в личный кабинет
    await loginPage.waitForLoginRedirect();
    
    // Проверка успешной авторизации
    expect(await loginPage.isLoggedIn()).toBe(true);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should allow user to reset password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.clickForgotPasswordLink();
    
    // Проверка перехода на страницу восстановления
    await expect(page).toHaveURL(/.*password-reset/);
    
    const emailInput = page.locator('[data-testid="reset-email"]');
    await emailInput.fill('test@example.com');
    await page.locator('[data-testid="reset-submit"]').click();
    
    // Проверка сообщения об отправке
    await expect(page.locator('text="Instruction sent to your email"')).toBeVisible();
  });
});
```

### 3. Тестирование мобильной версии:
```typescript
// e2e/specs/mobile/mobile-navigation.e2e.ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../models/pages/ProductsPage';

test.use({ ...devices['Pixel 5'] }); // Используем мобильное устройство

test.describe('Mobile Navigation', () => {
  test('should open mobile menu and navigate to products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    await page.goto('/');
    
    // Открытие мобильного меню
    await page.locator('[data-testid="mobile-menu-toggle"]').click();
    
    // Проверка отображения меню
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Переход к продуктам
    await page.locator('text="Продукты"').click();
    
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
    await expect(productCards.first()).toHaveCSS('padding', '20px');
    await expect(productCards.locator('[data-testid="add-to-cart"]')).toHaveCSS('width', '100%');
  });

  test('should handle mobile form inputs correctly', async ({ page }) => {
    await page.goto('/auth');
    
    // Проверка адаптации формы на мобильном устройстве
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toHaveCSS('width', '100%');
    await expect(emailInput).toHaveCSS('padding', '16px'); // Большой touch target
    
    // Проверка корректного отображения клавиатуры
    await emailInput.focus();
    expect(await emailInput.isFocused()).toBe(true);
  });
});
```

## Visual Regression Testing

### Проверка регрессии интерфейса:
```typescript
// e2e/specs/visual/visual-regression.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match design of homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Ждем появления основного контента
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    await expect(page).toHaveScreenshot('homepage.png', { 
      maxDiffPixelRatio: 0.02, // 2% допустимых различий
      fullPage: true
    });
  });

  test('should match design of products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    // Ждем загрузки продуктов
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
    
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

  test('should match mobile design', async ({ page }) => {
    test.skip(!page.viewportSize()?.width || page.viewportSize()?.width! > 768, 'Only runs on mobile devices');

    await page.goto('/');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', { 
      fullPage: true 
    });
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

## Network Interception & Mocking

### Мокирование API вызовов:
```typescript
// e2e/specs/api-mocking/api-mock.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('API Mocking', () => {
  test('should mock products API response', async ({ page }) => {
    // Мокирование API для получения продуктов
    await page.route('**/api/products*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            products: [
              { id: '1', name: 'Test Product', price: 990, description: 'Test product description' },
              { id: '2', name: 'Another Product', price: 1990, description: 'Another test product description' }
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
          message: 'Internal server error occurred',
          code: 'SERVER_ERROR'
        })
      });
    });

    await page.goto('/auth');
    
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password123!');
    await page.locator('[data-testid="login-submit"]').click();
    
    // Проверка отображения сообщения об ошибке
    await expect(page.locator('text="Internal server error occurred"')).toBeVisible();
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
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            network: 'TRC20',
            warnings: ['Make sure to complete payment within 30 minutes']
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
    await expect(page.locator('[data-testid="amount"]')).toHaveText('990 ₽');
  });

  test('should intercept and verify request data', async ({ page }) => {
    let interceptedRequest: any;

    // Перехват запроса
    await page.route('**/api/auth/register', async (route, request) => {
      interceptedRequest = request;
      await route.fallback();
    });

    await page.goto('/auth');
    
    // Переключение на регистрацию
    await page.locator('text="Зарегистрироваться"').click();
    
    // Заполнение формы
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password123!');
    await page.locator('[data-testid="telegram-input"]').fill('@testuser');
    
    // Отправка формы
    await page.locator('[data-testid="register-submit"]').click();
    
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

## Performance Testing

### Тестирование производительности:
```typescript
// e2e/specs/performance/performance.e2e.ts
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
    const response = await page.waitForResponse('**/');
    const timing = response.timing();
    
    // TTFB должен быть быстрым
    expect(timing.responseStart).toBeLessThan(600); // 600мс
  });

  test('should handle multiple concurrent users', async ({ page }) => {
    // Простой тест на производительность с несколькими страницами
    const startTime = Date.now();
    
    // Открытие нескольких страниц одновременно
    const page2 = await page.context().newPage();
    const page3 = await page.context().newPage();
    
    await Promise.all([
      page.goto('/'),
      page2.goto('/products'),
      page3.goto('/auth')
    ]);
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(10000); // 10 секунд для 3 страниц
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

## Accessibility Testing

### Проверка доступности:
```typescript
// e2e/specs/accessibility/accessibility.e2e.ts
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
    const h1Elements = await page.getByRole('heading', { level: 1 }).all();
    expect(h1Elements.length).toBeGreaterThan(0);
    expect(h1Elements.length).toBeLessThan(3); // Не должно быть слишком много H1
    
    // Проверка, что H2 следуют за H1
    const h2Elements = await page.getByRole('heading', { level: 2 }).all();
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

## Configuration

### Playwright конфигурация:
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  /* Параметры выполнения */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : Infinity,
  
  /* Временные настройки */
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
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
    command: process.env.CI ? 'npm run build && npx serve -s dist' : 'npm run dev',
    url: process.env.BASE_URL || 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Fixtures:

#### auth.setup.ts:
```typescript
// e2e/fixtures/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Переход на страницу логина
  await page.goto('/auth');

  // Ввод данных пользователя
  await page.locator('[data-testid="email-input"]').fill(process.env.TEST_USER_EMAIL || 'test@example.com');
  await page.locator('[data-testid="password-input"]').fill(process.env.TEST_USER_PASSWORD || 'Password123!');

  // Нажатие кнопки входа
  await page.locator('[data-testid="login-submit"]').click();

  // Дождаться редиректа на аккаунт
  await page.waitForURL('/account');

  // Сохранение состояния аутентификации
  await page.context().storageState({ path: authFile });
});
```

## Best Practices

### Naming Convention:
- Имена тестов описывают поведение/ожидаемый результат
- Использование Given-When-Then структуры
- Один тест - одно проверка
- Четкая иерархия тестов через describe блоки

### Page Object Model:
- Единый источник истины для элементов страницы
- Повторное использование в нескольких тестах
- Поддержка читаемости и поддерживаемости
- Изоляция изменений в DOM от тестов

### Тестирование пользовательских сценариев:
- Тестирование полных пользовательских сценариев
- Проверка всех взаимодействий с интерфейсом
- Тестирование пользовательских потоков
- Проверка граничных условий

### Performance:
- Параллельное выполнение тестов
- Использование fixtures для подготовки данных
- Избегание дублирования логики
- Оптимизация тестов на длительность выполнения

### Reliability:
- Использование явных и неявных ожиданий
- Избегание фиксированных задержек
- Обработка асинхронных операций корректно
- Использование auto-waiting возможностей Playwright

## Reporting & Monitoring

### Built-in reporting:
- HTML отчеты с трейсами выполнения
- JUnit XML для CI/CD интеграции
- Видеозаписи упавших тестов
- Скриншоты ошибок
- Trace viewer для отладки

### Performance metrics:
- Время загрузки страниц
- Время выполнения тестов
- Процент прохождения
- Показатели доступности
- Визуальные регрессии

---

## Заключение

E2E тестирование в AIBRO Business обеспечивает высокое качество пользовательского опыта через:
- Проверку полных пользовательских сценариев
- Тестирование на разных устройствах и браузерах
- Проверку доступности и производительности
- Автоматическую проверку после каждого изменения
- Визуальную регрессию
- Обнаружение проблем на ранних этапах

Тесты покрывают все основные сценарии использования приложения и обеспечивают уверенность в корректной работе системы.