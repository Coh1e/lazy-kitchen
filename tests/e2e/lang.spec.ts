import { test, expect } from '@playwright/test';
import { VIEWER_URL } from './_url.ts';

test('switching ZH → EN changes sidebar text and content', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.waitForLoadState('domcontentloaded');

  // Default = ZH; "开始" group exists
  await expect(page.locator('.sidebar h3').first()).toContainText('开始');

  // Click EN switch
  await page.locator('.lang-switch a', { hasText: 'EN' }).click();
  await page.waitForFunction(() => location.hash.startsWith('#/en'));

  // Sidebar should now use English headings
  await expect(page.locator('.sidebar h3').first()).toContainText('Start');

  // Cover should be rendered in English
  await expect(page.locator('.section-header__title')).toContainText('Make Kitchen Great Again');
});

test('switching back to ZH preserves expected layout', async ({ page }) => {
  await page.goto(VIEWER_URL);
  await page.evaluate(() => { location.hash = '#/en/cover'; });
  await page.waitForFunction(() => location.hash.startsWith('#/en'));

  await page.locator('.lang-switch a', { hasText: 'ZH' }).click();
  await page.waitForFunction(() => location.hash.startsWith('#/zh'));
  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');
});
