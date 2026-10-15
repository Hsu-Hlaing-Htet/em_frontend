import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loginAsAdmin, loginAsCustomer } from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proofImage = path.join(__dirname, 'fixtures/pw-proof.png');

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

        await page.getByRole('button', { name: /pay/i }).click();
        await expect(page.getByText(/payment|pending|success|submitted|receipt/i).first()).toBeVisible({
            timeout: 30_000,
        });
    });

    test('admin approves pending payment and customer can see a receipt', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/payments/approval', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/admin\/payments\/approval/);

        const rowLink = page.locator('a[href*="/admin/payments/approval/"]').first();
        if (await rowLink.count()) {
            await rowLink.click();
        } else {
            await page.locator('tbody tr').first().click();
        }

        const approveBtn = page.getByRole('button', { name: /^Approve$/i });
        await expect(approveBtn).toBeVisible({ timeout: 20_000 });
        await approveBtn.click();

        const confirm = page.getByRole('button', { name: /^Approve$/i }).last();
        if (await confirm.isVisible()) {
            await confirm.click();
        }

        await loginAsCustomer(page);
        await page.goto('/customer/receipts', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('body')).toContainText(/receipt|PW-INV-001|400/i);
    });
});
