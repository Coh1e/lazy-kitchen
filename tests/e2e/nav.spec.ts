import { test, expect } from '@playwright/test';
import { gotoAndReady } from './_url.ts';

test('clicking sidebar link changes URL hash and content', async ({ page }) => {
  await gotoAndReady(page);

  const link = page.locator('.sidebar a', { hasText: '使用循环' });
  await link.click();

  await page.waitForFunction(() => location.hash.includes('start/workflow'));
  await expect(page.locator('main h1, main .section-header__title').first()).toBeVisible();
  expect(page.url()).toContain('#/zh/start/workflow');
});

test('navigating to a dish detail page renders composition formula', async ({ page }) => {
  await gotoAndReady(page);
  await page.evaluate(() => { location.hash = '#/zh/compose/canton-clear-beef-noodles'; });
  await expect(page.locator('main')).toContainText('清汤牛腩粉', { timeout: 10000 });
});

test('bulletin board renders dish-card grid', async ({ page }) => {
  await gotoAndReady(page, '#/zh/board/proposed');
  await expect(page.locator('.dish-card').first()).toBeVisible();
  expect(await page.locator('.dish-card').count()).toBeGreaterThanOrEqual(50);
});
