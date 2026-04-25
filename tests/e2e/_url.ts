import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

/** Absolute file:// URL of the built lazy-kitchen.html viewer. */
export const VIEWER_URL = pathToFileURL(join(process.cwd(), 'lazy-kitchen.html')).toString();

/**
 * goto + wait until the SPA's render() has populated `main` (Linux CI is
 * slower than Windows local; Playwright's domcontentloaded fires before our
 * DOMContentLoaded listener completes).
 */
export async function gotoAndReady(page: Page, hash = ''): Promise<void> {
  await page.goto(VIEWER_URL + hash);
  await page.waitForFunction(() =>
    !!document.querySelector('.sidebar h3') &&
    !!document.querySelector('main')?.firstElementChild
  , null, { timeout: 10000 });
}
