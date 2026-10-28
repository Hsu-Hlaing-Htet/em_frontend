import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../backend');
if (!process.env.PW_SYSTEM_TEST_RUNTIME && !process.argv.includes('--list')) {
    throw new Error('Use npm run test:system (or a Timebox script) to create the verified disposable database.');
}

// Use localhost (not 127.0.0.1) so Origin matches backend CORS_ALLOWED_ORIGINS.
const FRONTEND_URL = process.env.PW_FRONTEND_URL || 'http://localhost:5174';
const BACKEND_URL = process.env.PW_BACKEND_URL || 'http://127.0.0.1:8010';

export default defineConfig({
    testDir: './tests/system',
    outputDir: process.env.PW_SYSTEM_TEST_RUNTIME ? path.join(process.env.PW_SYSTEM_TEST_RUNTIME, 'playwright-results') : 'test-results',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 90_000,
    expect: { timeout: 15_000 },
    reporter: [['list'], ...(process.env.PW_SYSTEM_RESULTS_FILE ? [['json', { outputFile: process.env.PW_SYSTEM_RESULTS_FILE }]] : [])],
    globalSetup: './tests/system/global-setup.js',
    globalTeardown: './tests/system/global-teardown.js',
    use: {
        baseURL: FRONTEND_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'off',
        actionTimeout: 15_000,
        navigationTimeout: 60_000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'bash scripts/system_test_serve.sh',
            cwd: backendRoot,
            url: `${BACKEND_URL}/up`,
            reuseExistingServer: false,
            timeout: 120_000,
        },
        {
            command: `npm run dev -- --host localhost --port 5174`,
            cwd: __dirname,
            url: FRONTEND_URL,
            reuseExistingServer: false,
            timeout: 120_000,
            env: {
                ...process.env,
                VITE_API_BASE_URL: `${BACKEND_URL}/api`,
            },
        },
    ],
});
