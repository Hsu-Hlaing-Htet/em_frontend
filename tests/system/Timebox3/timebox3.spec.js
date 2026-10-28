import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.js';

test.describe('Timebox 3 — Utilities foundation', () => {
    test('admin can open utility types management', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utility-types', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('body')).toBeVisible();
        await expect(page).toHaveURL(/utility-type/);
    });

    test('admin can open the utilities list workspace', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utilities', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/admin\/utilities/);
        await expect(page.locator('main, .admin-panel, body').first()).toBeVisible();
    });

    test('admin can open utility rates', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utility-rates', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/admin\/utility-rates/);
    });
});
