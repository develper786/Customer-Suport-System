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

  test('protectedRoute_redirectsToLogin_whenNotAuthenticated', async ({ page }) => {
    // Clear any existing localStorage
    await page.evaluate(() => localStorage.clear());

    await page.goto('/dashboard');

    // Should redirect to /login
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });
});
