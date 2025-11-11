import { test, expect } from '@playwright/test';

test.describe('Navigation and Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if main hero section is visible
    await expect(page.locator('text=AIRBRO')).toBeVisible();

    // Check if CTA button exists
    await expect(page.locator('button:has-text("Start")').first()).toBeVisible();
  });

  test('should navigate to pricing section via menu', async ({ page }) => {
    // Click on pricing link in navigation
    await page.click('text=Pricing', { force: true });

    // Wait for pricing section to be visible
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('should navigate to products section', async ({ page }) => {
    // Click on products link
    await page.click('text=Products', { force: true });

    // Check if products section is visible
    await expect(page.locator('#products')).toBeInViewport();
  });

  test('should navigate to FAQ section', async ({ page }) => {
    // Scroll to FAQ
    await page.click('text=FAQ', { force: true });

    // Check if FAQ section is visible
    await expect(page.locator('#faq')).toBeInViewport();
  });

  test('should toggle language switcher', async ({ page }) => {
    // Find language switcher button (usually contains EN or RU)
    const langButton = page.locator('button:has-text("EN"), button:has-text("RU")').first();

    if (await langButton.isVisible()) {
      await langButton.click();

      // Check that menu appeared (language options)
      await expect(page.locator('text=English, text=Русский').first()).toBeVisible({
        timeout: 2000,
      });
    }
  });

  test('should toggle theme (dark/light mode)', async ({ page }) => {
    // Find theme toggle button (sun/moon icon)
    const themeButton = page
      .locator('[aria-label*="theme"], button:has-text("☀"), button:has-text("🌙")')
      .first();

    if (await themeButton.isVisible()) {
      // Click theme toggle
      await themeButton.click();

      // Check that theme changed (data-theme attribute or class)
      const htmlElement = page.locator('html');
      const hasThemeAttribute = await htmlElement.getAttribute('data-theme');

      expect(hasThemeAttribute).toBeTruthy();
    }
  });

  test('should open modal when clicking on a module card', async ({ page }) => {
    // Scroll to products section
    await page.click('text=Products', { force: true });
    await page.waitForTimeout(1000);

    // Click on first product card with "Learn More" or similar
    const learnMoreButton = page
      .locator('button:has-text("Learn More"), button:has-text("Details")')
      .first();

    if (await learnMoreButton.isVisible()) {
      await learnMoreButton.click();

      // Check if modal appeared
      await expect(page.locator('[role="dialog"], .modal').first()).toBeVisible({ timeout: 3000 });

      // Close modal
      await page.locator('button:has-text("Close"), [aria-label="Close"]').first().click();
    }
  });

  test('should display footer with social links', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check if footer is visible
    await expect(page.locator('footer')).toBeVisible();

    // Check if copyright text exists
    await expect(page.locator('text=©, text=AIRBRO').first()).toBeVisible();
  });

  test('should show responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if hamburger menu button is visible
    const menuButton = page
      .locator('button:has-text("☰"), [aria-label*="menu"], button:has([class*="hamburger"])')
      .first();

    if (await menuButton.isVisible()) {
      // Click menu button
      await menuButton.click();

      // Check if mobile menu appeared
      await expect(page.locator('[role="navigation"], .mobile-menu, nav').first()).toBeVisible();
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that no critical errors occurred
    expect(errors.length).toBe(0);
  });
});
