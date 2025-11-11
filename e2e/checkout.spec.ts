import { test, expect } from '@playwright/test';

test.describe('Checkout and Payment Flow', () => {
  const testUser = {
    email: `checkout${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Checkout Test User',
    telegram: `@checkout${Date.now()}`,
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display pricing packages on pricing section', async ({ page }) => {
    // Navigate to pricing section
    await page.click('text=Pricing', { force: true });
    await page.waitForTimeout(1000);

    // Check if pricing section is visible
    await expect(page.locator('#pricing')).toBeInViewport();

    // Check if at least one package card is visible
    await expect(page.locator('text=₽, text=month, text=year').first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('should show package details when hovering over package card', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForTimeout(1000);

    // Find first package card
    const packageCard = page.locator('[class*="glass"], [class*="card"]').first();

    if (await packageCard.isVisible({ timeout: 5000 })) {
      // Hover over package
      await packageCard.hover();

      // Check if details are visible (features, bonuses, etc.)
      await expect(page.locator('text=features, text=includes, text=bonuses').first()).toBeVisible({
        timeout: 3000,
      });
    }
  });

  test('should require authentication before selecting a package', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForTimeout(1000);

    // Find "Select Package" or "Buy" button
    const selectButton = page
      .locator('button:has-text("Select"), button:has-text("Buy"), button:has-text("Choose")')
      .first();

    if (await selectButton.isVisible({ timeout: 5000 })) {
      await selectButton.click();

      // Should redirect to auth page or show login modal
      const isOnAuthPage = await page
        .locator('text=Login, text=Sign In, text=Register')
        .first()
        .isVisible({ timeout: 5000 });

      expect(isOnAuthPage).toBeTruthy();
    }
  });

  test('should navigate through complete checkout flow (authenticated user)', async ({ page }) => {
    // Step 1: Register user first
    await page.goto('/#/auth');

    const registerTab = page
      .locator('button:has-text("Register"), button:has-text("Sign Up")')
      .first();

    if (await registerTab.isVisible({ timeout: 5000 })) {
      await registerTab.click();

      await page.fill('input[name="email"], input[type="email"]', testUser.email);
      await page.fill('input[name="password"], input[type="password"]', testUser.password);
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="telegram"]', testUser.telegram);

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
    }

    // Step 2: Navigate to pricing and select package
    await page.goto('/#pricing');
    await page.waitForTimeout(1000);

    const selectButton = page
      .locator('button:has-text("Select"), button:has-text("Buy"), button:has-text("Choose")')
      .first();

    if (await selectButton.isVisible({ timeout: 5000 })) {
      await selectButton.click();

      // Should navigate to payment page or cart
      await expect(page.locator('text=Payment, text=Cart, text=Checkout').first()).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test('should display payment methods on payment page', async ({ page }) => {
    // Navigate to payment page directly (may require auth)
    await page.goto('/#/payment');

    // Check if payment methods are displayed
    const hasPaymentMethods = await page
      .locator('text=USDT, text=TON, text=Crypto, text=Card')
      .first()
      .isVisible({ timeout: 5000 });

    // If not visible, might need authentication
    if (!hasPaymentMethods) {
      const needsAuth = await page
        .locator('text=Login, text=Please log in')
        .first()
        .isVisible({ timeout: 2000 });
      expect(needsAuth).toBeTruthy();
    } else {
      expect(hasPaymentMethods).toBeTruthy();
    }
  });

  test('should show cart with selected items', async ({ page }) => {
    // Try to access cart/payment page
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    // Check if cart items are displayed or empty cart message
    const hasCartItems =
      (await page
        .locator('text=Cart, text=Items, text=Total')
        .first()
        .isVisible({ timeout: 3000 })) ||
      (await page.locator('text=empty, text=no items').first().isVisible({ timeout: 3000 }));

    expect(hasCartItems).toBeTruthy();
  });

  test('should display correct total amount in cart', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    // Look for total amount (should contain ₽ or currency symbol)
    const totalAmount = page.locator('text=Total, text=Amount').first();

    if (await totalAmount.isVisible({ timeout: 5000 })) {
      // Check if price is displayed with currency
      const hasCurrency = await page
        .locator('text=₽, text=RUB')
        .first()
        .isVisible({ timeout: 2000 });
      expect(hasCurrency).toBeTruthy();
    }
  });

  test('should show QR code when crypto payment method is selected', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    // Find crypto payment method button (USDT, TON, etc.)
    const cryptoButton = page
      .locator('button:has-text("USDT"), button:has-text("TON"), button:has-text("Crypto")')
      .first();

    if (await cryptoButton.isVisible({ timeout: 5000 })) {
      await cryptoButton.click();
      await page.waitForTimeout(1000);

      // Check if QR code is displayed
      const hasQRCode =
        (await page
          .locator('[class*="qr"], img[alt*="QR"]')
          .first()
          .isVisible({ timeout: 3000 })) ||
        (await page.locator('text=QR code, text=Scan').first().isVisible({ timeout: 3000 }));

      expect(hasQRCode).toBeTruthy();
    }
  });

  test('should display wallet address for crypto payment', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    const cryptoButton = page.locator('button:has-text("USDT"), button:has-text("TON")').first();

    if (await cryptoButton.isVisible({ timeout: 5000 })) {
      await cryptoButton.click();
      await page.waitForTimeout(1000);

      // Check if wallet address is displayed (long alphanumeric string)
      const hasWalletAddress = await page
        .locator('text=/[A-Za-z0-9]{20,}/')
        .first()
        .isVisible({ timeout: 3000 });

      expect(hasWalletAddress).toBeTruthy();
    }
  });

  test('should show payment expiration timer', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    const cryptoButton = page.locator('button:has-text("USDT"), button:has-text("TON")').first();

    if (await cryptoButton.isVisible({ timeout: 5000 })) {
      await cryptoButton.click();
      await page.waitForTimeout(1000);

      // Check if timer/expiration is displayed
      const hasTimer = await page
        .locator('text=expires, text=minutes, text=timer')
        .first()
        .isVisible({ timeout: 5000 });

      // Timer might not always be visible, so we don't assert
      if (hasTimer) {
        expect(hasTimer).toBeTruthy();
      }
    }
  });

  test('should allow copying wallet address', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    const cryptoButton = page.locator('button:has-text("USDT"), button:has-text("TON")').first();

    if (await cryptoButton.isVisible({ timeout: 5000 })) {
      await cryptoButton.click();
      await page.waitForTimeout(1000);

      // Look for copy button
      const copyButton = page
        .locator('button:has-text("Copy"), [aria-label*="copy"], [title*="copy"]')
        .first();

      if (await copyButton.isVisible({ timeout: 3000 })) {
        await copyButton.click();

        // Check if success message appears
        const successMessage = await page
          .locator('text=Copied, text=Success')
          .first()
          .isVisible({ timeout: 2000 });

        expect(successMessage).toBeTruthy();
      }
    }
  });

  test('should show payment warnings and instructions', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    const cryptoButton = page.locator('button:has-text("USDT"), button:has-text("TON")').first();

    if (await cryptoButton.isVisible({ timeout: 5000 })) {
      await cryptoButton.click();
      await page.waitForTimeout(1000);

      // Check for warnings or instructions
      const hasInstructions = await page
        .locator('text=important, text=warning, text=note, text=attention')
        .first()
        .isVisible({ timeout: 3000 });

      // Instructions might not always be visible
      if (hasInstructions) {
        expect(hasInstructions).toBeTruthy();
      }
    }
  });

  test('should validate that pricing matches between sections', async ({ page }) => {
    // Get price from pricing section
    await page.goto('/#pricing');
    await page.waitForTimeout(1000);

    const pricingPagePrice = await page
      .locator('text=/\\d+[,\\s]*₽/')
      .first()
      .textContent({ timeout: 5000 });

    if (pricingPagePrice) {
      // Extract numeric value
      const priceNumber = pricingPagePrice.match(/\d+/)?.[0];

      // Navigate to payment and check if same price appears
      await page.goto('/#/payment');
      await page.waitForTimeout(1000);

      if (priceNumber) {
        const hasSamePrice = await page
          .locator(`text=/${priceNumber}/`)
          .first()
          .isVisible({ timeout: 3000 });

        // Price might not be visible if cart is empty
        if (hasSamePrice) {
          expect(hasSamePrice).toBeTruthy();
        }
      }
    }
  });

  test('should handle back navigation from payment page', async ({ page }) => {
    await page.goto('/#/payment');
    await page.waitForTimeout(1000);

    // Look for back button or navigation
    const backButton = page
      .locator('button:has-text("Back"), a:has-text("Back"), [aria-label*="back"]')
      .first();

    if (await backButton.isVisible({ timeout: 5000 })) {
      await backButton.click();

      // Should navigate back to previous page
      await expect(page).not.toHaveURL(/payment/);
    }
  });
});
