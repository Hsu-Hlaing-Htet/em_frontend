import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loginAsAdmin, selectDropdown } from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const utilityFile = path.join(__dirname, '.last-tb3-utility');
const utilityMonthFile = path.join(__dirname, '.last-tb3-month');

test.describe.configure({ mode: 'serial' });
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

    test('admin can create a utility record through the UI', async ({ page }) => {
        const billingMonth = new Date();
        billingMonth.setMonth(billingMonth.getMonth() - 2, 1);
        const monthText = `${String(billingMonth.getDate()).padStart(2, '0')}/${String(billingMonth.getMonth() + 1).padStart(2, '0')}/${billingMonth.getFullYear()}`;

        await loginAsAdmin(page);
        await page.goto('/admin/utilities/create');
        await selectDropdown(page, 'Building', 'PW-Building-001');
        await selectDropdown(page, 'Room', 'PW-R-101');
        const billingMonthInput = page.locator('#create_billing_month input');
        await billingMonthInput.fill(monthText);
        await billingMonthInput.press('Tab');

        const row = page.locator('.p-datatable-tbody tr').first();
        await row.locator('.p-dropdown').click();
        await page.getByRole('option', { name: /electricity/i }).click();
        const currentReading = row.locator('td').nth(2).locator('input');
        await currentReading.fill('100');
        await currentReading.press('Tab');
        await page.getByRole('button', { name: /^Save$/i }).click();

        await expect(page).toHaveURL(/\/admin\/utilities/);
        await expect(page.getByText('PW-R-101')).toBeVisible({ timeout: 20_000 });
        const utilityRow = page.locator('tr').filter({ hasText: 'PW-R-101' }).first();
        await utilityRow.locator('a').click();
        await expect(page).toHaveURL(/\/admin\/utilities\/\d+/);
        const utilityId = page.url().match(/utilities\/(\d+)/)?.[1];
        expect(utilityId).toBeTruthy();
        fs.writeFileSync(utilityFile, utilityId, 'utf8');
        fs.writeFileSync(utilityMonthFile, monthText, 'utf8');
    });

    test('admin can submit the created utility and verify pending status', async ({ page }) => {
        const utilityId = fs.readFileSync(utilityFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto(`/admin/utilities/${utilityId}/edit`);
        await expect(page).toHaveURL(/\/admin\/utilities\/\d+\/edit/);
        await expect(page.getByText(/pending/i)).toBeVisible({ timeout: 20_000 });
    });

    test('admin can approve the utility and verify its draft invoice', async ({ page }) => {
        const utilityId = fs.readFileSync(utilityFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto('/admin/utilities/approval');
        const utilityRow = page.locator('tr').filter({ hasText: 'PW-R-101' });
        await expect(utilityRow).toBeVisible({ timeout: 20_000 });
        await utilityRow.locator('a').click();
        await expect(page).toHaveURL(new RegExp(`/admin/utilities/approval/${utilityId}`));
        await page.getByRole('button', { name: /^Approve$/i }).first().click();
        const confirm = page.locator('.p-dialog').getByRole('button', { name: /^Approve$/i });
        await expect(confirm).toBeVisible();
        await confirm.click();

        await expect(page).toHaveURL(/\/admin\/invoices\/approval/);
        await expect(page.locator('body')).toContainText(/draft|invoice/i);
        await expect(page.locator('body')).not.toContainText(/issued and sent/i);
    });
});
