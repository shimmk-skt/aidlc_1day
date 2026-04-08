import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('storefront loads products', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('storefront-search')).toBeVisible();
  });

  test('cart page shows empty state', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByTestId('empty-state-action')).toBeVisible();
  });
});
