import { test, expect } from '@playwright/test';
import { VIEWER_URL } from './_url.ts';

test('cover page loads, hero title visible, no JS errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto(VIEWER_URL);                         // → file:///.../lazy-kitchen.html
  await page.waitForLoadState('domcontentloaded');

  // Cover should be the default route → contains the slogan
  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');

  // Topbar brand visible
  await expect(page.locator('.topbar__brand')).toContainText('LAZY KITCHEN');

  // Sidebar mounted with 8 verb groups
  await expect(page.locator('.sidebar h3')).toHaveCount(8);

  expect(errors).toEqual([]);
});

test('all expected stat cards render on cover', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');
  // Cover has 4 hero stat cards + 3 method cards = 7 stat-card elements
  const cards = page.locator('.stat-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(7);
});
