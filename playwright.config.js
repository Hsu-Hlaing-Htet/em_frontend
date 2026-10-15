import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../backend');

// Use localhost (not 127.0.0.1) so Origin matches backend CORS_ALLOWED_ORIGINS.
const FRONTEND_URL = process.env.PW_FRONTEND_URL || 'http://localhost:5174';
const BACKEND_URL = process.env.PW_BACKEND_URL || 'http://127.0.0.1:8010';

export default defineConfig({
    testDir: './tests/system',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 90_000,
    expect: { timeout: 15_000 },
    reporter: [['list']],
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
