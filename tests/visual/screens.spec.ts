import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const VIEWER_URL = pathToFileURL(join(process.cwd(), 'lazy-kitchen.html')).toString();

const PAGES: { name: string; hash: string }[] = [
  { name: 'cover-zh',          hash: '#/zh/cover' },
  { name: 'cover-en',          hash: '#/en/cover' },
  { name: 'board-proposed-zh', hash: '#/zh/board/proposed' },
  { name: 'glossary-zh',       hash: '#/zh/glossary' },
  { name: 'compose-canton',    hash: '#/zh/compose/canton-clear-beef-noodles' },
  { name: 'start-workflow-zh', hash: '#/zh/start/workflow' },
];

for (const { name, hash } of PAGES) {
  test(`${name} matches baseline`, async ({ page }) => {
    await page.goto(VIEWER_URL + hash);
    await page.waitForLoadState('domcontentloaded');
    // Wait for fonts + first render to settle (web fonts load async)
    await page.waitForFunction(() => document.fonts ? document.fonts.ready : Promise.resolve(), null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
