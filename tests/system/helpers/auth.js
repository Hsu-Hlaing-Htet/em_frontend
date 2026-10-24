/**
 * Shared Playwright auth helpers for System Testing.
 */

export const USERS = {
    admin: {
        email: 'pw-admin@rosewoodroyale.test',
        password: 'p@ssword',
    },
    customer: {
        email: 'pw-customer@rosewoodroyale.test',
        password: 'p@ssword',
    },
    otherCustomer: {
        email: 'pw-other@rosewoodroyale.test',
        password: 'p@ssword',
    },
};

export async function preparePage(page) {
    // Avoid flaky hangs on third-party CDN assets during System Testing.
    await page.route('**/cdn.jsdelivr.net/**', (route) => route.abort());
    await page.route('**/cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function expectLoginForm(page) {
    await page.locator('#login-email').waitFor({ state: 'visible', timeout: 30_000 });
}

export async function loginAs(page, user) {
    await preparePage(page);
    await page.context().clearCookies();
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await expectLoginForm(page);
    await page.locator('#login-email').fill(user.email);
    await page.locator('#login-password').fill(user.password);

    const loginResponsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/auth/login') && res.request().method() === 'POST',
        { timeout: 30_000 },
    );

    await page.getByRole('button', { name: /^Login$/i }).click();
    const response = await loginResponsePromise;
    if (!response.ok()) {
        const body = await response.text();
        throw new Error(`Login failed (${response.status()}): ${body}`);
    }

    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30_000 });
    await page.waitForLoadState('domcontentloaded');
}

export async function loginAsAdmin(page) {
    await loginAs(page, USERS.admin);
}

export async function loginAsCustomer(page) {
    await loginAs(page, USERS.customer);
}

export async function loginAsOtherCustomer(page) {
    await loginAs(page, USERS.otherCustomer);
}

export async function selectDropdown(page, label, option) {
    const field = page.locator('.field').filter({ hasText: label }).first();

    await field.locator('.p-dropdown').click();
    await page.getByRole('option', { name: option, exact: true }).click();
}

export async function fillField(page, label, value) {
    const field = page.locator('.field').filter({ hasText: label }).first();

    await field.locator('input, textarea').first().fill(value);
}
