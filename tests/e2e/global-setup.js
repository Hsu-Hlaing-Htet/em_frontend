/**
 * Verifies Laravel API and Vue frontend are reachable before E2E runs.
 * Does not mutate production data.
 */
export default async function globalSetup(config) {
    const baseURL = config.projects[0]?.use?.baseURL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174';
    const apiBaseURL = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:8000/api';
    const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@rosewoodroyale.com';
    const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'p@ssword';

    const errors = [];

    try {
        const fe = await fetch(baseURL, { redirect: 'follow' });
        if (!fe.ok) {
            errors.push(`Frontend not healthy at ${baseURL} (HTTP ${fe.status})`);
        }
    } catch (error) {
        errors.push(`Frontend unavailable at ${baseURL}: ${error.message}`);
    }

    try {
        const login = await fetch(`${apiBaseURL.replace(/\/$/, '')}/auth/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        });

        if (!login.ok) {
            const body = await login.text();
            errors.push(
                `API login failed at ${apiBaseURL}/auth/login (HTTP ${login.status}). ` +
                    `Ensure seeded demo users exist. Body: ${body.slice(0, 200)}`,
            );
        } else {
            const json = await login.json();
            const token = json?.token ?? json?.data?.token;
            const user = json?.user ?? json?.data?.user;
            if (!token || !user) {
                errors.push('API login succeeded but response lacked token/user payload.');
            }
        }
    } catch (error) {
        errors.push(`API unavailable at ${apiBaseURL}: ${error.message}`);
    }

    if (errors.length) {
        throw new Error(
            `Playwright global setup failed:\n- ${errors.join('\n- ')}\n\n` +
                'Start the Laravel API and Vue Vite server, then re-run.',
        );
    }

    // eslint-disable-next-line no-console
    console.log(`E2E global setup OK — frontend ${baseURL}, API ${apiBaseURL}`);
}
