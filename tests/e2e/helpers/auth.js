import { expect } from '@playwright/test';
import { adminCredentials, customerCredentials } from './credentials.js';

export async function fillLoginForm(page, { email, password }) {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await page.getByPlaceholder('admin@rosewoodroyale.com').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
}

export async function submitLogin(page) {
    await page.getByRole('button', { name: 'Login' }).click();
}

export async function loginAsAdmin(page) {
    const credentials = adminCredentials();
    await fillLoginForm(page, credentials);
    await submitLogin(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('.admin-dashboard')).toBeVisible({ timeout: 20_000 });
}

export async function loginAsCustomer(page, credentials = customerCredentials()) {
    await fillLoginForm(page, credentials);
    await submitLogin(page);
    await expect(page).toHaveURL(/\/customer\/dashboard/);
}

export async function logoutViaUi(page) {
    const profileTrigger = page.getByRole('button', { name: /super_admin|Admin User|Kyaw Swar|customer|Mg Mg/i }).first();
    if (await profileTrigger.isVisible().catch(() => false)) {
        await profileTrigger.click();
        const logoutItem = page.getByText('Logout', { exact: true });
        if (await logoutItem.isVisible().catch(() => false)) {
            await logoutItem.click();
            await expect(page).toHaveURL(/\/login/);
            return;
        }
    }

    const logout = page.getByRole('button', { name: /log\s*out|logout/i }).or(
        page.getByText(/log\s*out|logout/i),
    );
    if (await logout.first().isVisible().catch(() => false)) {
        await logout.first().click();
        await expect(page).toHaveURL(/\/login/);
        return;
    }

    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.goto('/login');
}

export async function expectToast(page, text, { timeout = 15_000 } = {}) {
    const toast = page.locator('.p-toast').filter({ hasText: text }).first();
    await expect(toast).toBeVisible({ timeout });
}
