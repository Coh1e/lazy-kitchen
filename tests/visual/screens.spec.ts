import { test, expect } from '@playwright/test'

const VIEWER_URL = 'http://localhost:4173/'

const PAGES: { name: string; hash: string }[] = [
  { name: 'cover-zh',          hash: '#/zh/cover' },
  { name: 'cover-en',          hash: '#/en/cover' },
  { name: 'board-proposed-zh', hash: '#/zh/board/proposed' },
  { name: 'glossary-zh',       hash: '#/zh/glossary' },
  { name: 'compose-canton',    hash: '#/zh/compose/canton-clear-beef-noodles' },
  { name: 'start-workflow-zh', hash: '#/zh/start/workflow' },
]

for (const { name, hash } of PAGES) {
  test(`${name} matches baseline`, async ({ page }) => {
    await page.goto(VIEWER_URL + hash)
    await page.waitForFunction(
      () =>
        !!document.querySelector('.sidebar h3') &&
        !!document.querySelector('main')?.firstElementChild,
      null,
      { timeout: 10000 },
    )
    await page.waitForFunction(() => document.fonts ? document.fonts.ready : Promise.resolve(), null, { timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  })
}
