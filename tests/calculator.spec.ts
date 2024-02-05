import { test, expect } from '@playwright/test';

test('has expected title and heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Income Tax Calculator/);

  await expect(page.getByRole('heading', { name: 'Income Tax Calculator' })).toBeVisible();
});

