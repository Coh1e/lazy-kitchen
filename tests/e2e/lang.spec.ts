import { test, expect } from '@playwright/test';
import { gotoAndReady } from './_url.ts';

test('switching ZH → EN changes sidebar text and content', async ({ page }) => {
  await gotoAndReady(page);
  await expect(page.locator('.sidebar h3').first()).toContainText('开始');

  await page.locator('.lang-switch a', { hasText: 'EN' }).click();
  await page.waitForFunction(() => location.hash.startsWith('#/en'));
  await page.waitForFunction(() => document.querySelector('.sidebar h3')?.textContent?.includes('Start'));

  await expect(page.locator('.sidebar h3').first()).toContainText('Start');
  await expect(page.locator('.section-header__title')).toContainText('Make Kitchen Great Again');
});

test('switching back to ZH preserves expected layout', async ({ page }) => {
  await gotoAndReady(page, '#/en/cover');
  await expect(page.locator('.sidebar h3').first()).toContainText('Start');

  await page.locator('.lang-switch a', { hasText: 'ZH' }).click();
  await page.waitForFunction(() => location.hash.startsWith('#/zh'));
  await page.waitForFunction(() => document.querySelector('.sidebar h3')?.textContent?.includes('开始'));

  await expect(page.locator('.section-header__title')).toContainText('让人类拥有世界舌头');
});
