# E2E Tests for AIRBRO Business

This directory contains End-to-End (E2E) tests using Playwright to ensure critical user flows work correctly.

## 📋 Test Coverage

### navigation.spec.ts (10 tests)

Tests for general site navigation and UI:

- Homepage loading
- Navigation to sections (Products, Pricing, FAQ)
- Language switcher functionality
- Theme toggle (dark/light mode)
- Modal interactions
- Footer visibility
- Responsive mobile menu
- JavaScript error detection

### auth.spec.ts (10 tests)

Tests for authentication flows:

- Navigate to auth page
- Form validation (empty fields, invalid email)
- User registration
- Duplicate user prevention
- Login with valid credentials
- Invalid credentials handling
- Logout functionality
- Protected route access control

## 🚀 Running Tests

### Prerequisites

First-time setup:

```bash
# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# Run all E2E tests (headless mode)
npm run test:e2e

# Run tests in UI mode (with visual interface)
npm run test:e2e:ui

# Run tests in debug mode (step-by-step)
npm run test:e2e:debug

# View test report after running
npm run test:e2e:report
```

### Run Specific Tests

```bash
# Run only navigation tests
npx playwright test navigation.spec.ts

# Run only auth tests
npx playwright test auth.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## 🔧 Configuration

Configuration is in `playwright.config.ts`:

- Tests run on Chromium, Firefox, and WebKit
- Base URL: http://localhost:5173
- Automatic dev server startup
- Screenshots and videos on failure
- Test timeout: 30 seconds

## 📝 Writing New Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');

    // Act
    await page.click('button:has-text("Click Me")');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

## 🐛 Debugging Tests

1. **Use UI Mode** (`npm run test:e2e:ui`):
   - Visual interface for running/debugging tests
   - See real-time browser interactions
   - Inspect element selectors

2. **Use Debug Mode** (`npm run test:e2e:debug`):
   - Step through tests line by line
   - Pause execution with `await page.pause()`
   - Inspect page state

3. **Screenshots/Videos**:
   - Automatically saved in `test-results/` on failure
   - View in HTML report: `npm run test:e2e:report`

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

The report includes:

- Test results and durations
- Screenshots of failures
- Video recordings (on failure)
- Stack traces and error messages

## ✅ Best Practices

1. **Keep tests independent** - Each test should work standalone
2. **Use data-testid** - Add `data-testid` attributes for reliable selectors
3. **Avoid hard-coded waits** - Use `waitForSelector` instead of `setTimeout`
4. **Clean up after tests** - Reset state between tests
5. **Test critical paths** - Focus on most important user flows first

## 🔄 CI/CD Integration

Tests are configured to run in CI with:

- 2 retries on failure
- Single worker (sequential execution)
- HTML reporter for artifacts

Add to your CI workflow:

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)
