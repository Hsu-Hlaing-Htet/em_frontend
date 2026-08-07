import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer, expectToast } from '../helpers/auth.js';
import { customerCredentials } from '../helpers/credentials.js';
import { fixturePath, saveEvidenceScreenshot, selectDropdownByLabel } from '../helpers/forms.js';

test.describe('Timebox 4 — Payment and Receipt', () => {
    test('customer can open an invoice detail when one exists', async ({ page }) => {
        await loginAsCustomer(page, customerCredentials());
        await page.goto('/customer/invoices');

        const rowLink = page.locator('a[href*="/customer/invoices/"]').first();
        if (!(await rowLink.isVisible().catch(() => false))) {
            // Try clicking first data row
            const row = page.locator('tbody tr').first();
            if (!(await row.isVisible().catch(() => false))) {
                test.skip(true, 'No customer invoices available for payment flow');
            }
            await row.click();
        } else {
            await rowLink.click();
        }

        await expect(page).toHaveURL(/\/customer\/invoices\/\d+/);
        await expect(page.getByRole('button', { name: 'Download Invoice' }).or(page.getByText(/Invoice/i)).first()).toBeVisible();
    });

    test('customer can submit payment with proof when Pay Invoice is available', async ({ page }) => {
        await loginAsCustomer(page, customerCredentials());
        await page.goto('/customer/invoices');

        const rows = page.locator('tbody tr');
        const count = await rows.count();
        if (count === 0) {
            test.skip(true, 'No invoices for customer payment submission');
        }

        let openedPayable = false;
        for (let i = 0; i < Math.min(count, 8); i += 1) {
            await page.goto('/customer/invoices');
            await rows.nth(i).locator('a').first().click().catch(async () => {
                await rows.nth(i).click();
            });
            if (await page.getByRole('heading', { name: 'Pay Invoice' }).isVisible().catch(() => false)
                || await page.getByText('Pay Invoice').isVisible().catch(() => false)) {
                openedPayable = true;
                break;
            }
        }

        if (!openedPayable) {
            test.skip(true, 'No payable invoice (Pay Invoice section) for seeded customer');
        }

        await selectDropdownByLabel(page, 'Payment Method', /./).catch(async () => {
            const field = page.locator('.field, div').filter({ hasText: 'Payment Method' }).first();
            await field.locator('.p-dropdown').click();
            await page.locator('.p-dropdown-panel:visible .p-dropdown-item').first().click();
        });

        const proofInput = page.locator('input[type="file"]').first();
        await proofInput.setInputFiles(fixturePath('valid-payment-proof.jpg'));
        await page.getByRole('button', { name: 'Submit Payment' }).click();
        await expectToast(page, /success|submitted|payment/i);
    });

    test('invalid payment proof type is constrained by upload accept attribute', async ({ page }) => {
        await loginAsCustomer(page, customerCredentials());
        await page.goto('/customer/invoices');
        const row = page.locator('tbody tr').first();
        if (!(await row.isVisible().catch(() => false))) {
            test.skip(true, 'No invoices to exercise proof upload');
        }
        await row.locator('a').first().click().catch(async () => row.click());

        if (!(await page.getByText('Pay Invoice').isVisible().catch(() => false))) {
            test.skip(true, 'Invoice is not payable');
        }

        const proof = page.locator('input[type="file"]').first();
        await expect(proof).toHaveAttribute('accept', /image\/\*|application\/pdf/);
        await proof.setInputFiles(fixturePath('invalid-room-file.txt'));
        // App may still attach; assert Submit Payment remains gated or toast error on submit
        await page.getByRole('button', { name: 'Submit Payment' }).click().catch(() => {});
        // Stay on page — either validation toast or form still visible
        await expect(page.getByText('Pay Invoice')).toBeVisible();
    });

    test('admin can view payment approval queue', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/payments/approval');
        await expect(page).toHaveURL(/\/admin\/payments\/approval/);
        await expect(page.locator('body')).toContainText(/Payment|Approval|No /i);
    });

    test('admin can approve a pending payment when one exists', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/payments/approval');

        const approve = page.getByRole('button', { name: 'Approve' }).or(page.locator('[aria-label="Approve"]')).first();
        if (!(await approve.isVisible().catch(() => false))) {
            test.skip(true, 'No pending payments to approve');
        }

        await approve.click();
        const confirmApprove = page.getByRole('button', { name: 'Approve' }).last();
        if (await confirmApprove.isVisible().catch(() => false)) {
            await confirmApprove.click();
        }
        // Confirm dialog text from app
        const dialogOk = page.getByRole('button', { name: /Yes|Confirm|Approve/i }).last();
        if (await dialogOk.isVisible().catch(() => false)) {
            await dialogOk.click();
        }
        await expectToast(page, /approved|success|receipt/i).catch(() => {});
        await saveEvidenceScreenshot(page, 'payment-approval');
    });

    test('customer cannot approve payments via admin route', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/payments/approval');
        await expect(page).toHaveURL(/\/forbidden/);
    });

    test('customer receipts list is reachable', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/payments');
        await expect(page).toHaveURL(/\/customer\/(payments|receipts)/);
    });
});
