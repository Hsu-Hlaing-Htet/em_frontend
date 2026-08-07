import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174';
const apiBaseURL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Visible Timebox 1 demo only.
 * Does not affect normal `npx playwright test` runs (separate config file).
 */
export default defineConfig({
    testDir: path.join(__dirname, 'tests/e2e/Timebox1/demo'),
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 180_000,
    expect: { timeout: 30_000 },
    reporter: [['list']],
    globalSetup: path.join(__dirname, 'tests/e2e/global-setup.js'),
    globalTeardown: path.join(__dirname, 'tests/e2e/Timebox1/demo/global-teardown.js'),
    use: {
        baseURL,
        headless: false,
        launchOptions: {
            slowMo: 700,
        },
        screenshot: 'off',
        video: 'off',
        trace: 'off',
        actionTimeout: 40_000,
        navigationTimeout: 40_000,
        viewport: { width: 1440, height: 900 },
    },
    projects: [
        {
            name: 'chromium-demo',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Avoid writing report artifacts for demos
    outputDir: path.join(__dirname, 'test-results-demo'),
    metadata: {
        apiBaseURL,
        demo: true,
        slowMo: 700,
    },
});
