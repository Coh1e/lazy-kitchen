import { test, expect } from '@playwright/test';
import { gotoAndReady } from './_url.ts';

test.use({ viewport: { width: 375, height: 812 } });

test('mobile: hamburger toggles sidebar drawer open and closed', async ({ page }) => {
  await gotoAndReady(page);
  await expect(page.locator('.sidebar')).not.toHaveClass(/open/);

  await page.locator('.topbar__hamburger').click();
  await expect(page.locator('.sidebar')).toHaveClass(/open/);

  await page.locator('.sidebar a').first().click();
  await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
});

test('mobile: dish detail page renders on small viewport', async ({ page }) => {
  await gotoAndReady(page, '#/zh/compose/canton-clear-beef-noodles');
  await expect(page.locator('main')).toContainText('清汤牛腩粉', { timeout: 10000 });
});
