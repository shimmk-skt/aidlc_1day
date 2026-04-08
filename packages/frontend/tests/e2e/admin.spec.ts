import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test('redirects unauthenticated to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
