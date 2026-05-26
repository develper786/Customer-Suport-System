import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('loginSuccess_redirectsToDashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'admin123');
    await page.click('button:has-text("Login")');

    await page.waitForURL('**/dashboard/home');
    expect(page.url()).toContain('/dashboard/home');
  });

  test('loginFailure_showsErrorMessage', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid');
  });

  test('protectedRoute_redirectsToLogin_whenNotAuthenticated', async ({ context, page }) => {
    // Use a new context to ensure no stored user data
    const newContext = await context.browser().newContext();
    const newPage = await newContext.newPage();

    await newPage.goto('/dashboard');

    // Should redirect to /login
    await newPage.waitForURL('**/login');
    expect(newPage.url()).toContain('/login');
    await newContext.close();
  });
});
