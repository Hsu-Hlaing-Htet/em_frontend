import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loginAsAdmin, loginAsCustomer, loginAsOtherCustomer } from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const titleFile = path.join(__dirname, '.last-maint-title');
const invoiceFile = path.join(__dirname, '.last-maint-invoice');

test.describe.configure({ mode: 'serial' });

test.describe('Timebox 5 — Maintenance → Invoice Approval', () => {
    test('customer can create a maintenance request from the portal', async ({ page }) => {
        const title = `PW-MAINT-${Date.now()}`;

        await loginAsCustomer(page);
        await page.goto('/customer/maintenance-requests/new', { waitUntil: 'domcontentloaded' });

        await page.locator('#title').fill(title);

        await page.locator('#category').click();
        await page.getByRole('option').first().click();

        await page.locator('#room_id').click();
        await page.getByRole('option').first().click();

        await page.locator('#priority').click();
        await page.getByRole('option').first().click();

        await page.locator('#description').fill('Playwright system test maintenance issue.');
        await page.getByRole('button', { name: /submit|create|save/i }).click();

        await expect(page).toHaveURL(/\/customer\/maintenance-requests\/\d+$/);
        await page.goto('/customer/maintenance-requests', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText(title)).toBeVisible({ timeout: 20_000 });
        fs.writeFileSync(titleFile, title, 'utf8');
    });

    test('admin can accept and complete maintenance with a fee', async ({ page }) => {
        const title = fs.existsSync(titleFile) ? fs.readFileSync(titleFile, 'utf8').trim() : '';
        test.skip(!title, 'No maintenance title from previous test');

        await loginAsAdmin(page);
        await page.goto('/admin/maintenance-requests', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText(title)).toBeVisible({ timeout: 20_000 });
        await page.getByText(title).first().click();

        const accept = page.getByRole('button', { name: /^Accept$/i });
        await expect(accept).toBeVisible({ timeout: 15_000 });
        await accept.click();
        await expect(page.locator('body')).toContainText(/in progress/i);

        const workDone = page.getByRole('button', { name: /Work Done/i }).first();
        await expect(workDone).toBeVisible({ timeout: 15_000 });
        await workDone.click();

        await page.locator('#maintenance_fee_amount input').fill('50000');
        await page.locator('#resolution_note').fill('PW system test repair completed.');
        await page.locator('#charge_description').fill('PW Maintenance Fee');

        await page.getByRole('button', { name: /Work Done/i }).last().click();
        await expect(page.locator('body')).toContainText(/completed/i);
        await expect(page.locator('body')).toContainText(/50,000|50000/);
        const invoiceLink = page.locator('a').filter({ hasText: /INV-/i }).first();
        await expect(invoiceLink).toBeVisible({ timeout: 20_000 });
        fs.writeFileSync(invoiceFile, (await invoiceLink.textContent()).trim(), 'utf8');
    });

    test('maintenance fee draft appears in invoice approval queue', async ({ page }) => {
        const invoiceNumber = fs.readFileSync(invoiceFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto('/admin/invoices/approval', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/admin\/invoices\/approval/);
        const invoiceRow = page.locator('tr').filter({ hasText: invoiceNumber });
        await expect(invoiceRow).toBeVisible({ timeout: 20_000 });
        await invoiceRow.click();
        await expect(page).toHaveURL(/\/admin\/invoices\/approval\/\d+\/document/);
        await expect(page.locator('body')).toContainText(/Maintenance Fee/i);
        await expect(page.locator('body')).toContainText(/50,000|50000/);
    });

    test('other customer cannot see the maintenance request title', async ({ page }) => {
        const title = fs.existsSync(titleFile) ? fs.readFileSync(titleFile, 'utf8').trim() : '';
        test.skip(!title, 'No maintenance title from previous test');

        await loginAsOtherCustomer(page);
        await page.goto('/customer/maintenance-requests', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText(title)).toHaveCount(0);
    });
});
