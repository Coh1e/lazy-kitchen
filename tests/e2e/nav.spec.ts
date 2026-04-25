import { test, expect } from '@playwright/test';
import { VIEWER_URL } from './_url.ts';

test('clicking sidebar link changes URL hash and content', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');

  // Click the "Workflow" link in the START group
  const link = page.locator('.sidebar a', { hasText: '使用循环' });
  await link.click();

  await page.waitForFunction(() => location.hash.includes('start/workflow'));
  await expect(page.locator('main h1, main .section-header__title').first()).toBeVisible();
  expect(page.url()).toContain('#/zh/start/workflow');
});

test('navigating to a dish detail page renders composition formula', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => { location.hash = '#/zh/compose/canton-clear-beef-noodles'; });
  await page.waitForFunction(() => location.hash.endsWith('canton-clear-beef-noodles'));
  // Just confirm the title is rendered
  await expect(page.locator('main')).toContainText('清汤牛腩粉');
});

test('bulletin board renders dish-card grid', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.evaluate(() => { location.hash = '#/zh/board/proposed'; });
  await page.waitForFunction(() => location.hash.endsWith('board/proposed'));
  await expect(page.locator('.dish-card').first()).toBeVisible();
  // Should be many planned dishes
  expect(await page.locator('.dish-card').count()).toBeGreaterThanOrEqual(50);
});
