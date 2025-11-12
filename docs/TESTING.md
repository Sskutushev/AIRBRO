# Testing Guide

Comprehensive testing strategy for AIRBRO Business platform covering unit, integration, and end-to-end tests.

## Testing Philosophy

**Test the behavior, not the implementation.** Focus on what users can do and what the system guarantees, not internal details.

**Test pyramid approach**:
```
        /\
       /  \  E2E (few, high-level)
      /____\
     /      \  Integration (moderate)
    /________\
   /          \  Unit (many, fast)
  /____________\
```

## Stack

- **Vitest**: Unit & integration tests (frontend + backend)
- **Playwright**: E2E tests (full user flows)
- **Testing Library**: React component testing
- **Supertest**: HTTP assertion library (backend)
- **MSW**: Mock Service Worker (API mocking)

## Frontend Testing

### Unit Tests

Test individual components and utilities in isolation.

**Location**: `src/**/*.test.tsx`

**Example**:
```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Run**:
```bash
npm test                    # Run all tests
npm test Button             # Run specific test
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

### Integration Tests

Test multiple components working together with API calls.

**Example**:
```typescript
// src/pages/Cart.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Cart } from './Cart';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Cart Page', () => {
  it('displays cart items', async () => {
    // Mock API response
    server.use(
      http.get('/api/cart', () => {
        return HttpResponse.json({
          items: [
            { id: '1', product: { name: 'Pro Plan' }, quantity: 1 }
          ],
          total: 990000
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Cart />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    });
  });

  it('removes item when delete button clicked', async () => {
    // Test implementation...
  });
});
```

### Mocking API Calls

Use MSW to intercept API calls during tests.

**Setup**: `src/mocks/server.ts`
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Handlers**: `src/mocks/handlers.ts`
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Starter', price: 490000 }
    ]);
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (email === 'test@airbro.com' && password === 'Test123!') {
      return HttpResponse.json({
        token: 'mock_token',
        user: { id: '1', email }
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),
];
```

### Component Testing Best Practices

1. **Test user interactions, not implementation**
   ```typescript
   // Good
   await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
   
   // Bad
   await userEvent.click(wrapper.find('.cart-button'));
   ```

2. **Use accessible queries**
   ```typescript
   // Preferred order
   screen.getByRole('button')
   screen.getByLabelText('Email')
   screen.getByPlaceholderText('Enter email')
   screen.getByText('Submit')
   ```

3. **Wait for async updates**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

4. **Test error states**
   ```typescript
   it('shows error when API fails', async () => {
     server.use(
       http.get('/api/cart', () => {
         return new HttpResponse(null, { status: 500 });
       })
     );
     
     render(<Cart />);
     await waitFor(() => {
       expect(screen.getByText(/error loading cart/i)).toBeInTheDocument();
     });
   });
   ```

## Backend Testing

### Unit Tests

Test services, utilities, and business logic.

**Location**: `backend/src/**/*.test.ts`

**Example**:
```typescript
// backend/src/services/authService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from './authService';
import { db } from '../config/database';

describe('AuthService', () => {
  beforeEach(async () => {
    await db.user.deleteMany(); // Clean database
  });

  describe('register', () => {
    it('creates new user with hashed password', async () => {
      const user = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        telegram: '@testuser'
      });

      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).not.toBe('SecurePass123!');
      expect(user.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt hash
    });

    it('throws error for duplicate email', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'User',
        telegram: '@user1'
      });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'Pass123!',
          name: 'User 2',
          telegram: '@user2'
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('returns token for valid credentials', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'User',
        telegram: '@user'
      });

      const result = await authService.login('test@example.com', 'Pass123!');
      
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('throws error for invalid password', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'User',
        telegram: '@user'
      });

      await expect(
        authService.login('test@example.com', 'WrongPass!')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### Integration Tests

Test API endpoints with real HTTP requests.

**Example**:
```typescript
// backend/src/routes/auth.test.ts
import request from 'supertest';
import { app } from '../server';
import { db } from '../config/database';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it('creates user and returns token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        telegram: '@testuser'
      })
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'SecurePass123!',
        name: 'Test User',
        telegram: '@testuser'
      })
      .expect(400);

    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 409 for duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'User 1',
        telegram: '@user1'
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'User 2',
        telegram: '@user2'
      })
      .expect(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await db.user.deleteMany();
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        telegram: '@testuser'
      });
  });

  it('returns token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it('returns 401 for invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword!'
      })
      .expect(401);
  });
});
```

### Testing Protected Routes

```typescript
describe('GET /api/cart', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await db.user.deleteMany();
    
    // Create user and get token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'Test',
        telegram: '@test'
      });
    
    token = response.body.token;
    userId = response.body.user.id;
  });

  it('returns cart items', async () => {
    // Add item to cart
    await db.cartItem.create({
      data: {
        userId,
        productId: 'product-id',
        quantity: 1
      }
    });

    const response = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.items).toHaveLength(1);
  });

  it('returns 401 without token', async () => {
    await request(app)
      .get('/api/cart')
      .expect(401);
  });
});
```

### Run Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm test -- --run           # Run once (no watch)
npm run test:coverage       # With coverage
npm run test:ui             # Interactive UI
```

## End-to-End Tests

Test complete user flows in real browser.

**Location**: `e2e/**/*.spec.ts`

**Setup**: `playwright.config.ts`
```typescript
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
```

### E2E Test Examples

**User Registration Flow**:
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can register', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign Up');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="telegram"]', '@testuser');
    
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign Up');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Pass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email')).toBeVisible();
  });
});
```

**Shopping Cart Flow**:
```typescript
// e2e/cart.spec.ts
test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
  });

  test('user can add product to cart', async ({ page }) => {
    await page.goto('/pricing');
    
    // Click "Add to Cart" on Pro plan
    await page.click('button:has-text("Add to Cart") >> nth=1');
    
    // Cart badge should update
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    
    // Navigate to cart
    await page.click('[data-testid="cart-icon"]');
    
    // Verify product is in cart
    await expect(page.locator('text=Pro Plan')).toBeVisible();
  });

  test('user can checkout', async ({ page }) => {
    // Add product to cart
    await page.goto('/pricing');
    await page.click('button:has-text("Add to Cart")');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    
    // Proceed to checkout
    await page.click('text=Checkout');
    
    // Select payment method
    await page.click('text=USDT (TRC20)');
    await page.click('button:has-text("Create Payment")');
    
    // Should show payment details
    await expect(page.locator('text=Send USDT to this address')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
  });
});
```

**Full Purchase Flow**:
```typescript
test('complete purchase flow', async ({ page }) => {
  // 1. Register
  await page.goto('/');
  await page.click('text=Sign Up');
  await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="telegram"]', '@testuser');
  await page.click('button[type="submit"]');

  // 2. Browse products
  await page.goto('/pricing');
  await expect(page.locator('h1:has-text("Pricing")')).toBeVisible();

  // 3. Add to cart
  await page.click('button:has-text("Add to Cart") >> nth=0');
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');

  // 4. Go to cart
  await page.click('[data-testid="cart-icon"]');
  await expect(page.locator('text=Your Cart')).toBeVisible();

  // 5. Checkout
  await page.click('button:has-text("Checkout")');
  
  // 6. Select payment method
  await page.click('text=USDT (TRC20)');
  await page.click('button:has-text("Create Payment")');

  // 7. Verify payment details shown
  const walletAddress = await page.locator('[data-testid="wallet-address"]').textContent();
  expect(walletAddress).toMatch(/^T[A-Za-z0-9]{33}$/); // TRC20 address format

  // 8. Verify QR code shown
  await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
});
```

### Run E2E Tests

```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Interactive UI mode
npm run test:e2e:debug        # Debug mode (step through)
npm run test:e2e:report       # View test report
```

### E2E Best Practices

1. **Use data-testid for dynamic content**
   ```tsx
   <div data-testid="cart-badge">{count}</div>
   ```

2. **Wait for navigation**
   ```typescript
   await page.click('button');
   await page.waitForURL('/dashboard');
   ```

3. **Take screenshots on failure**
   ```typescript
   test('something', async ({ page }) => {
     // ... test code
     await page.screenshot({ path: 'failure.png', fullPage: true });
   });
   ```

4. **Use fixtures for common setup**
   ```typescript
   const test = base.extend({
     authenticatedPage: async ({ page }, use) => {
       await page.goto('/login');
       await page.fill('input[name="email"]', 'test@example.com');
       await page.fill('input[name="password"]', 'Pass123!');
       await page.click('button[type="submit"]');
       await use(page);
     },
   });
   ```

## Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

**Generate coverage report**:
```bash
npm run test:coverage
```

Opens HTML report in `coverage/index.html`.

## CI/CD Testing

Tests run automatically on:
- **Pull Requests**: All tests must pass
- **Main branch push**: Full test suite + E2E
- **Nightly**: Full regression suite

See [CI/CD.md](CI_CD.md) for pipeline details.

## Debugging Tests

### Vitest Debugging

```bash
# Run single test file
npm test -- src/components/Button.test.tsx

# Run tests matching pattern
npm test -- --grep "user can login"

# Run in watch mode with UI
npm run test:ui
```

### Playwright Debugging

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run specific test file
npx playwright test e2e/auth.spec.ts
```

### VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Vitest",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('loads data on mount', async () => {
  render(<UserList />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  // Verify data rendered
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Testing Forms

```typescript
it('submits form with valid data', async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'Pass123!');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Pass123!'
    });
  });
});
```

### Testing Error Boundaries

```typescript
it('renders error UI when component throws', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

Testing ensures reliability and enables confident refactoring. Write tests for all critical paths, edge cases, and error scenarios.
