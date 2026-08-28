import { defineConfig, devices } from '@playwright/test';

/**
 * Central configuration for the SauceDemo automation suite.
 * Keeping all environment/browser/reporting concerns here means
 * individual test files stay free of setup logic.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000, // web-first assertion timeout — no manual waits needed
  },

  // Run spec files in parallel; within a file, tests also run in parallel
  // unless a describe block is explicitly marked serial.
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,

  // Fail the CI build if someone accidentally leaves a `.only` in the code.
  forbidOnly: !!process.env.CI,

  // Flaky-test safety net in CI only — local failures should surface immediately.
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }], // for CI dashboards
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    trace: 'retain-on-failure',       // full trace only when a test fails
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Cross-browser coverage — bonus requirement.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
