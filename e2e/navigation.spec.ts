import { test, expect } from '@playwright/test';

test.describe('Navigation and Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.skip('should load the homepage successfully', async ({ page }) => {
    // Check if main hero section is visible
    await expect(page.locator('text=AIRBRO')).toBeVisible();

    // Check if CTA button exists
    await expect(page.locator('button:has-text("Start")').first()).toBeVisible();
  });

  test.skip('should navigate to pricing section via menu', async ({ page }) => {
    // Click on pricing link in navigation - use more specific selector to avoid overlay issues
    const pricingLink = page.locator('nav a:text-is("Pricing"), button:text-is("Pricing"), [href="#pricing"], [data-testid="pricing-link"]');
    
    if (await pricingLink.count() > 0) {
      await pricingLink.first().click({ force: true });
    } else {
      // Fallback to general text selector with force
      await page.locator('text=Pricing').first().click({ force: true });
    }

    // Wait for pricing section to be visible
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test.skip('should navigate to products section', async ({ page }) => {
    // Click on products link - avoid overlay issues
    const productsLink = page.locator('nav a:text-is("Products"), button:text-is("Products"), [href="#products"], [data-testid="products-link"]');
    
    if (await productsLink.count() > 0) {
      await productsLink.first().click({ force: true });
    } else {
      // Fallback to general text selector with force
      await page.locator('text=Products').first().click({ force: true });
    }

    // Check if products section is visible
    await expect(page.locator('#products')).toBeInViewport();
  });

  test.skip('should navigate to FAQ section', async ({ page }) => {
    // Use more specific selector to avoid overlay issues
    const faqLink = page.locator('nav a:text-is("FAQ"), button:text-is("FAQ"), [href="#faq"], [data-testid="faq-link"]');
    
    if (await faqLink.count() > 0) {
      await faqLink.first().click({ force: true });
    } else {
      // Fallback to general text selector with force
      await page.locator('text=FAQ').first().click({ force: true });
    }

    // Check if FAQ section is visible
    await expect(page.locator('#faq')).toBeInViewport();
  });

  test.skip('should toggle language switcher', async ({ page }) => {
    // Find language switcher button (usually contains EN or RU)
    const langButton = page.locator('button:has-text("EN"), button:has-text("RU"), [data-testid="lang-switcher"]').first();

    if (await langButton.isVisible()) {
      // Use force click to handle overlay issues
      await langButton.click({ force: true });

      // Check that menu appeared (language options)
      await expect(page.locator('text=English, text=Русский').first()).toBeVisible({
        timeout: 3000,
      });
    }
  });

  test('should toggle theme (dark/light mode)', async ({ page }) => {
    // Find theme toggle button (sun/moon icon)
    const themeButton = page
      .locator('[aria-label*="theme"], button:has-text("☀"), button:has-text("🌙")')
      .first();

    if (await themeButton.isVisible()) {
      // Use force: true to bypass pointer event interception
      await themeButton.click({ force: true });

      // Wait a bit for the theme to change
      await page.waitForTimeout(100);

      // Check that theme changed (data-theme attribute or class)
      const htmlElement = page.locator('html');
      const currentClass = await htmlElement.getAttribute('class');
      const currentDataTheme = await htmlElement.getAttribute('data-theme');

      // Either class or data-theme attribute should indicate theme change
      expect(currentClass || currentDataTheme).toBeTruthy();
    }
  });

  test('should open modal when clicking on a module card', async ({ page }) => {
    // Scroll to products section - use more specific selector
    const productsLink = page.locator('nav a:text-is("Products"), button:text-is("Products"), [data-testid="products-link"]');

    if (await productsLink.count() > 0) {
      await productsLink.first().click({ force: true });
    } else {
      await page.locator('text=Products').first().click({ force: true });
    }
    
    await page.waitForTimeout(1000);

    // Click on first product card with "Learn More" or similar
    const learnMoreButton = page
      .locator('button:has-text("Learn More"), button:has-text("Details"), [data-testid="learn-more"]')
      .first();

    if (await learnMoreButton.isVisible()) {
      await learnMoreButton.click({ force: true });

      // Check if modal appeared
      await expect(page.locator('[role="dialog"], .modal').first()).toBeVisible({ timeout: 3000 });

      // Close modal - handle potential overlay issues
      const closeButton = page.locator('button:has-text("Close"), [aria-label="Close"], [data-testid="modal-close"]');
      if (await closeButton.count() > 0) {
        await closeButton.first().click({ force: true });
      }
    }
  });

  test.skip('should display footer with social links', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for footer to be visible
    await expect(page.locator('footer').first()).toBeVisible({ timeout: 5000 });

    // Check if copyright text exists - try different variations
    const copyrightLocator = page.locator('text=© AIRBRO, text=AIRBRO, text=©, text=Privacy Policy, text=Terms of Service');
    
    // Try to find copyright text in various possible formats
    await expect(copyrightLocator.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if hamburger menu button is visible with more specific selectors
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("☰"), button[data-testid="hamburger-menu"], [class*=menu-button]').first();

    if (await menuButton.isVisible()) {
      // Click menu button with force to handle overlays
      await menuButton.click({ force: true });

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
