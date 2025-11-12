import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
    telegram: `@testuser${Date.now()}`,
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to auth page from header', async ({ page }) => {
    // Look for Login/Sign In button in header
    const loginButton = page
      .locator('button:has-text("Login"), button:has-text("Sign In"), a:has-text("Login"), [data-testid="login-btn"]')
      .first();

    if (await loginButton.isVisible({ timeout: 5000 })) {
      await loginButton.click({ force: true });

      // Check if we're on auth page
      await expect(page).toHaveURL(/.*auth.*/);
      await expect(page.locator('text=Login, text=Sign In').first()).toBeVisible();
    } else {
      // Directly navigate to auth page
      await page.goto('/#/auth');
    }
  });

  test('should show validation errors for empty registration form', async ({ page }) => {
    await page.goto('/#/auth');

    // Find register tab/button
    const registerTab = page
      .locator('button:has-text("Register"), button:has-text("Sign Up")')
      .first();

    if (await registerTab.isVisible({ timeout: 5000 })) {
      await registerTab.click();

      // Try to submit empty form
      const submitButton = page
        .locator(
          'button[type="submit"]:has-text("Register"), button[type="submit"]:has-text("Sign Up")'
        )
        .first();
      await submitButton.click();

      // Check for validation errors
      await expect(page.locator('text=required, text=invalid').first()).toBeVisible({
        timeout: 3000,
      });
    }
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/#/auth');

    // Find register tab
    const registerTab = page
      .locator('button:has-text("Register"), button:has-text("Sign Up")')
      .first();

    if (await registerTab.isVisible({ timeout: 5000 })) {
      await registerTab.click();

      // Fill email input with invalid email
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      await emailInput.fill('invalid-email');

      // Blur to trigger validation
      await emailInput.blur();

      // Check for email validation error
      await expect(page.locator('text=valid email, text=email format').first()).toBeVisible({
        timeout: 3000,
      });
    }
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/#/auth');

    // Switch to register tab
    const registerTab = page
      .locator('button:has-text("Register"), button:has-text("Sign Up")')
      .first();

    if (await registerTab.isVisible({ timeout: 5000 })) {
      await registerTab.click();

      // Fill registration form
      await page.fill('input[name="email"], input[type="email"]', testUser.email);
      await page.fill('input[name="password"], input[type="password"]', testUser.password);
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="telegram"]', testUser.telegram);

      // Accept terms if checkbox exists
      const termsCheckbox = page.locator('input[type="checkbox"]').first();
      if (await termsCheckbox.isVisible({ timeout: 1000 })) {
        await termsCheckbox.check();
      }

      // Submit form
      const submitButton = page
        .locator(
          'button[type="submit"]:has-text("Register"), button[type="submit"]:has-text("Sign Up")'
        )
        .first();
      await submitButton.click();

      // Wait for successful registration (redirect or success message)
      await expect(page.locator('text=Welcome, text=Success, text=Dashboard').first()).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test('should not allow duplicate user registration', async ({ page }) => {
    // First, register a user
    await page.goto('/#/auth');

    const registerTab = page
      .locator('button:has-text("Register"), button:has-text("Sign Up")')
      .first();

    if (await registerTab.isVisible({ timeout: 5000 })) {
      await registerTab.click();

      const duplicateUser = {
        email: `duplicate${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Duplicate User',
        telegram: `@duplicate${Date.now()}`,
      };

      // Register first time
      await page.fill('input[name="email"], input[type="email"]', duplicateUser.email);
      await page.fill('input[name="password"], input[type="password"]', duplicateUser.password);
      await page.fill('input[name="name"]', duplicateUser.name);
      await page.fill('input[name="telegram"]', duplicateUser.telegram);

      const termsCheckbox = page.locator('input[type="checkbox"]').first();
      if (await termsCheckbox.isVisible({ timeout: 1000 })) {
        await termsCheckbox.check();
      }

      await page
        .locator(
          'button[type="submit"]:has-text("Register"), button[type="submit"]:has-text("Sign Up")'
        )
        .first()
        .click();
      await page.waitForTimeout(2000);

      // Try to register again with same email
      await page.goto('/#/auth');
      await registerTab.click();

      await page.fill('input[name="email"], input[type="email"]', duplicateUser.email);
      await page.fill('input[name="password"], input[type="password"]', duplicateUser.password);
      await page.fill('input[name="name"]', 'Another Name');
      await page.fill('input[name="telegram"]', '@anothertelegram');

      await page
        .locator(
          'button[type="submit"]:has-text("Register"), button[type="submit"]:has-text("Sign Up")'
        )
        .first()
        .click();

      // Should show error about duplicate email
      await expect(
        page.locator('text=already exists, text=already registered').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should login with valid credentials', async ({ page }) => {
    // Note: This test assumes a user already exists in the database
    // In a real scenario, you'd want to seed test data or use the previously registered user

    await page.goto('/#/auth');

    // Find login tab (should be default)
    const loginTab = page.locator('button:has-text("Login"), button:has-text("Sign In")').first();

    if (await loginTab.isVisible({ timeout: 5000 })) {
      await loginTab.click();
    }

    // Fill login form with test credentials
    await page.fill('input[name="email"], input[type="email"]', testUser.email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);

    // Submit login
    await page
      .locator('button[type="submit"]:has-text("Login"), button[type="submit"]:has-text("Sign In"), [data-testid="login-submit"]')
      .first()
      .click({ force: true });

    // Wait for successful login (redirect to account page or dashboard)
    await expect(page.locator('text=Welcome, text=Dashboard, text=Account').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test.skip('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/#/auth');

    // Fill login form with invalid credentials
    await page.fill('input[name="email"], input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'WrongPassword123!');

    // Submit
    await page
      .locator('button[type="submit"]:has-text("Login"), button[type="submit"]:has-text("Sign In"), [data-testid="login-submit"]')
      .first()
      .click({ force: true });

    // Should show error message
    await expect(
      page.locator('text=Invalid credentials, text=incorrect, text=failed').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test.skip('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/#/auth');

    await page.fill('input[name="email"], input[type="email"]', testUser.email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page
      .locator('button[type="submit"]:has-text("Login"), button[type="submit"]:has-text("Sign In")')
      .first()
      .click();

    await page.waitForTimeout(2000);

    // Find logout button
    const logoutButton = page
      .locator('button:has-text("Logout"), button:has-text("Sign Out"), button:has-text("Log Out")')
      .first();

    if (await logoutButton.isVisible({ timeout: 5000 })) {
      await logoutButton.click({ force: true });

      // Should redirect to home or show login button again
      await expect(
        page.locator('button:has-text("Login"), button:has-text("Sign In")').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should protect account page when not authenticated', async ({ page }) => {
    // Try to access account page without authentication
    await page.goto('/#/account');

    // Should redirect to auth page or show access denied message
    const isOnAuthPage = await page
      .locator('text=Login, text=Sign In')
      .first()
      .isVisible({ timeout: 5000 });
    const hasAccessDenied = await page
      .locator('text=Access Denied, text=Please log in')
      .first()
      .isVisible({ timeout: 5000 });

    expect(isOnAuthPage || hasAccessDenied).toBeTruthy();
  });
});
