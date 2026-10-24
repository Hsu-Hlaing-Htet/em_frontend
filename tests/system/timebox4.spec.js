import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loginAsAdmin, loginAsCustomer } from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proofImage = path.join(__dirname, 'fixtures/pw-proof.png');
const paymentFile = path.join(__dirname, '.last-tb4-payment');

test.describe.configure({ mode: 'serial' });

test.describe('Timebox 4 — Invoice → Payment → Receipt', () => {
    test('customer sees issued invoice PW-INV-001', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/invoices', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('PW-INV-001')).toBeVisible({ timeout: 20_000 });
    });

    test('customer submits payment with proof for PW-INV-001', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/invoices', { waitUntil: 'domcontentloaded' });
        await page.getByText('PW-INV-001').first().click();
        await expect(page).toHaveURL(/\/customer\/invoices\/\d+/);

        // List opens document view; continue to Make Payment.
        const payLink = page.getByRole('link', { name: /pay/i });
        if (await payLink.count()) {
            await payLink.first().click();
        } else {
            const href = page.url();
            const id = href.match(/invoices\/(\d+)/)?.[1];
            await page.goto(`/customer/invoices/${id}#make-payment`, { waitUntil: 'domcontentloaded' });
        }

        await expect(page.locator('#make-payment')).toBeVisible({ timeout: 20_000 });
        await page.locator('#customer_payment_method').click();
        await page.getByRole('option').first().click();

        const fileInput = page.locator('#make-payment input[type="file"]');
        await expect(fileInput).toBeAttached({ timeout: 10_000 });
        await fileInput.setInputFiles(proofImage);

        const paymentResponse = page.waitForResponse(
            (response) => response.url().includes('/api/customer/payments')
                && response.request().method() === 'POST',
        );
        await page.getByRole('button', { name: /pay/i }).click();
        const paymentPayload = await (await paymentResponse).json();
        const paymentId = paymentPayload?.data?.id || paymentPayload?.data?.data?.id;
        expect(paymentId).toBeTruthy();
        fs.writeFileSync(paymentFile, String(paymentId), 'utf8');
        await expect(page.getByText(/payment|pending|success|submitted|receipt/i).first()).toBeVisible({
            timeout: 30_000,
        });
        await expect(page.locator('body')).toContainText(/pending/i);
    });

    test('admin approves pending payment and customer can see a receipt', async ({ page }) => {
        const paymentId = fs.readFileSync(paymentFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto('/admin/payments/approval', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/admin\/payments\/approval/);

        const rowLink = page.locator(`a[href="/admin/payments/approval/${paymentId}"]`);
        await expect(rowLink).toBeVisible({ timeout: 20_000 });
        await rowLink.click();

        const approveBtn = page.getByRole('button', { name: /^Approve$/i });
        await expect(approveBtn).toBeVisible({ timeout: 20_000 });
        await approveBtn.click();

        const confirm = page.getByRole('button', { name: /^Approve$/i }).last();
        if (await confirm.isVisible()) {
            await confirm.click();
        }

        await expect(page).toHaveURL(new RegExp(`/admin/payments/${paymentId}`));
        await expect(page.locator('body')).toContainText(/approved/i);
        await expect(page.locator('body')).toContainText(/PW-INV-001/);

        await loginAsCustomer(page);
        await page.goto('/customer/receipts', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('body')).toContainText(/PW-INV-001/i);
        await expect(page.locator('body')).toContainText(/receipt/i);
    });
});
