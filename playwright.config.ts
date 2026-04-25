import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    // baseURL intentionally unset — file:// + relative path doesn't resolve
    // sanely. Tests import VIEWER_URL from tests/e2e/_url.ts.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // 2 logical groups: e2e behaviour + visual snapshots
  projects: [
    {
      name: 'e2e-desktop',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'visual-desktop',
      testMatch: /tests\/visual\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
      // Tighter snapshot diff threshold for desktop
      snapshotPathTemplate: '{testDir}/visual/__screenshots__/{testFilePath}/{arg}-desktop{ext}',
    },
    {
      name: 'visual-mobile',
      testMatch: /tests\/visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
      snapshotPathTemplate: '{testDir}/visual/__screenshots__/{testFilePath}/{arg}-mobile{ext}',
    },
  ],

  expect: {
    // Allow 2% pixel diff to soak up sub-pixel font rendering differences
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
});
