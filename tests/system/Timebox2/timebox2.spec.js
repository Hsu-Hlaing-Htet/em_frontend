import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer, loginAsOtherCustomer } from '../helpers/auth.js';

test.describe('Timebox 2 — Contracts & customer ownership', () => {
    test('admin can view the seeded active rent room in the UI', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rent-contracts/active', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('PW-R-101')).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText('PW-Building-001')).toBeVisible();
    });

    test('customer can view their own rent contract property', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/contracts', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText(/PW-Building-001|PW-R-101|Rent/i).first()).toBeVisible({
            timeout: 20_000,
        });
    });

    test('other customer does not see PW building/room contract', async ({ page }) => {
        await loginAsOtherCustomer(page);
        await page.goto('/customer/contracts', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('PW-Building-001')).toHaveCount(0);
        await expect(page.getByText('PW-R-101')).toHaveCount(0);
    });
});
