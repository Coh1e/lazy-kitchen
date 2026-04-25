import type { Page } from '@playwright/test'

/**
 * Vite preview server URL. playwright.config.ts auto-starts `npm run preview`
 * on port 4173 before the test suite runs (webServer config).
 */
export const VIEWER_URL = 'http://localhost:4173/'

/**
 * goto + wait until React has mounted Layout (sidebar nav) + the route's first
 * element. CI is slower than local; default Playwright `domcontentloaded` fires
 * before React renders the SPA tree.
 */
export async function gotoAndReady(page: Page, hash = ''): Promise<void> {
  await page.goto(VIEWER_URL + hash)
  await page.waitForFunction(
    () =>
      !!document.querySelector('.sidebar h3') &&
      !!document.querySelector('main')?.firstElementChild,
    null,
    { timeout: 10000 },
  )
}
