import { test, expect } from '@playwright/test';
import { VIEWER_URL } from './_url.ts';

test('typing in topbar search filters pages and shows result list', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');

  const search = page.locator('#search');
  await search.fill('philosophy');

  // Result list shows up — should contain at least one dish-card link
  await expect(page.locator('main h1')).toContainText('Search:');
  expect(await page.locator('main .dish-card').count()).toBeGreaterThanOrEqual(1);
});

test('clearing search returns to current page', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');
  const search = page.locator('#search');
  await search.fill('xyz');
  await expect(page.locator('main h1')).toContainText('Search:');
  await search.fill('');
  // Empty search → re-render the original page (cover)
  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');
});
