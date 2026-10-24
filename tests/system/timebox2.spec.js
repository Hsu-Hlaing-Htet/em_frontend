import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    loginAsAdmin,
    loginAsCustomer,
    loginAsOtherCustomer,
    selectDropdown,
} from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractFile = path.join(__dirname, '.last-tb2-contract-room');

test.describe.configure({ mode: 'serial' });
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

    test('admin can create a rent contract draft through the UI', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rooms');
        await page.getByText('PW-R-201').click();
        await page.getByRole('button', { name: /^Contract$/i }).click();
        await expect(page).toHaveURL(/\/rooms\/\d+\/create-contract/);

        await selectDropdown(page, 'Tenant 1', 'PW Customer One');
        await selectDropdown(page, 'Payment Type', 'Full');
        const startDate = page.locator('.field').filter({ hasText: 'Start Date' }).first().locator('input').first();
        const today = new Date();
        const startDateText = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        await startDate.fill(startDateText);
        await startDate.press('Tab');
        await page.getByRole('button', { name: /^Submit$/i }).click();

        await expect(page).toHaveURL(/\/admin\/approvals\/rent-contracts/);
        await expect(page.getByText('PW-R-201')).toBeVisible({ timeout: 20_000 });
        await expect(page.locator('tr').filter({ hasText: 'PW-R-201' }).getByRole('button', { name: /^Approve$/i })).toBeVisible();
        fs.writeFileSync(contractFile, 'PW-R-201', 'utf8');
    });

    test('admin can approve the rent contract and the room becomes occupied', async ({ page }) => {
        const roomNumber = fs.readFileSync(contractFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto('/admin/approvals/rent-contracts');
        const row = page.locator('tr').filter({ hasText: roomNumber });
        await expect(row).toBeVisible({ timeout: 20_000 });
        await row.locator('a').first().click();

        await page.locator('.pdf-actions').getByRole('button', { name: /^Approve$/i }).click();
        await expect(page.getByText('Approve this rent contract?', { exact: true })).toBeVisible();
        const confirm = page.locator('.p-dialog').getByRole('button', { name: /^Approve$/i });
        await expect(confirm).toBeVisible();
        await confirm.click();

        await expect(page).toHaveURL(/\/admin\/rent-contracts\/active/);
        await expect(page.getByText(roomNumber)).toBeVisible({ timeout: 20_000 });

        await page.goto('/admin/rooms');
        const roomRow = page.locator('tr').filter({ hasText: roomNumber });
        await expect(roomRow).toContainText(/occupied/i);
    });
});
