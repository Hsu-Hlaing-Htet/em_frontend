import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174';
const apiBaseURL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Rosewood Royale E2E — Vue frontend against a running Laravel API.
 * Expects local frontend + API to be available (see global-setup.js).
 */
export default defineConfig({
    testDir: path.join(__dirname, 'tests/e2e'),
    testIgnore: ['**/Timebox1/demo/**'],
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    timeout: 90_000,
    expect: { timeout: 15_000 },
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: path.join(__dirname, 'playwright-report') }],
        ['json', { outputFile: path.join(__dirname, 'test-results/playwright-results.json') }],
    ],
    globalSetup: path.join(__dirname, 'tests/e2e/global-setup.js'),
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off',
        actionTimeout: 20_000,
        navigationTimeout: 30_000,
        viewport: { width: 1440, height: 900 },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    outputDir: path.join(__dirname, 'test-results'),
    metadata: {
        apiBaseURL,
    },
});
