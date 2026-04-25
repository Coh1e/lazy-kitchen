import { test, expect } from '@playwright/test';
import { gotoAndReady } from './_url.ts';

test('typing in topbar search filters pages and shows result list', async ({ page }) => {
  await gotoAndReady(page);
  await page.locator('#search').fill('philosophy');
  await expect(page.locator('main h1')).toContainText('Search:');
  expect(await page.locator('main .dish-card').count()).toBeGreaterThanOrEqual(1);
});

test('clearing search returns to current page', async ({ page }) => {
  await gotoAndReady(page);
  const search = page.locator('#search');
  await search.fill('xyz');
  await expect(page.locator('main h1')).toContainText('Search:');
  await search.fill('');
  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');
});
