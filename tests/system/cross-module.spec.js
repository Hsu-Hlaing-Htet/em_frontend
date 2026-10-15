import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from './helpers/auth.js';

test.describe('Cross-module System workflow', () => {
    test('seeded invoice remains visible across admin and customer portals', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/invoices', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('PW-INV-001')).toBeVisible({ timeout: 20_000 });

        await loginAsCustomer(page);
        await page.goto('/customer/invoices', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('PW-INV-001')).toBeVisible({ timeout: 20_000 });
        await page.getByText('PW-INV-001').first().click();
        await expect(page).toHaveURL(/\/customer\/invoices\/\d+/);
        await expect(page.getByRole('link', { name: /pay/i })).toBeVisible({ timeout: 20_000 });
    });
});
