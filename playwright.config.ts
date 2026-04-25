import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:4173/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
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
