import { defineConfig, devices } from '@playwright/test';

// Real end-to-end tests need a static production build served by `vite
// preview` (the dev server injects HMR client code and different timing
// characteristics than what actually ships).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: {
      // A tiny tolerance for sub-pixel font/anti-aliasing noise between
      // runs; layout or color regressions are still well above this.
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: 'http://localhost:4319',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build -- --base=/ && npm run preview -- --port=4319 --strictPort',
    url: 'http://localhost:4319',
    // Never reuse an already-running server on this port — an unrelated local
    // project could be squatting on it, which would silently point every
    // test at the wrong app instead of failing loudly.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    // Cross-browser engine coverage. Only "chromium" runs visual.spec.js —
    // it has its own baseline images; every other project skips that file
    // entirely so it doesn't need (and drift out of sync with) one too.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: '**/visual.spec.js' },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: '**/visual.spec.js' },

    // Responsive / device viewport coverage
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testIgnore: '**/visual.spec.js' },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, testIgnore: '**/visual.spec.js' },
    { name: 'tablet', use: { ...devices['iPad Mini landscape'] }, testIgnore: '**/visual.spec.js' },
  ],
});
