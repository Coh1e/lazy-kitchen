import { test, expect } from '@playwright/test';
import { gotoAndReady } from './_url.ts';

test('cover page loads, hero title visible, no JS errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await gotoAndReady(page);

  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');
  await expect(page.locator('.topbar__brand')).toContainText('LAZY KITCHEN');
  await expect(page.locator('.sidebar h3')).toHaveCount(8);

  expect(errors).toEqual([]);
});

test('all expected stat cards render on cover', async ({ page }) => {
  await gotoAndReady(page);
  const cards = page.locator('.stat-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(7);
});
