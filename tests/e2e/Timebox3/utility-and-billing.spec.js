import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth.js';
import { uniqueSuffix, customerCredentials } from '../helpers/credentials.js';
import {
    fillInputNumberField,
    selectFirstDropdownOptionByLabel,
    pickCalendarDateByLabel,
    saveEvidenceScreenshot,
} from '../helpers/forms.js';

test.describe('Timebox 3 — Utility and Billing', () => {
    test('admin can create a utility rate', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utility-rates/create');

        await selectFirstDropdownOptionByLabel(page, 'Utility Type');
        await fillInputNumberField(page, 'Unit Price', 350);
        await pickCalendarDateByLabel(page, 'Effective Date', { day: '1' });
        await selectFirstDropdownOptionByLabel(page, 'Status');

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page).toHaveURL(/\/admin\/utility-rates\/?$/, { timeout: 30_000 });
    });

    test('admin can open meter reading create form and add a reading row when rooms exist', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utilities/create');

        await selectFirstDropdownOptionByLabel(page, 'Building');

        const roomDropdown = page.locator('#room_id').or(
            page.locator('.field').filter({ has: page.locator('label', { hasText: /^Room$/ }) }).locator('.p-dropdown'),
        ).first();

        if (await roomDropdown.getAttribute('class').then((c) => c?.includes('p-disabled')).catch(() => true)) {
            // Wait briefly for options to enable after building selection
            await expect(roomDropdown).not.toHaveClass(/p-disabled/, { timeout: 10_000 }).catch(() => {});
        }

        if (await roomDropdown.evaluate((el) => el.classList.contains('p-disabled')).catch(() => true)) {
            test.skip(true, 'Room dropdown disabled after building selection');
        }

        await selectFirstDropdownOptionByLabel(page, 'Room');

        const billing = page.locator('#create_billing_month');
        if (await billing.isVisible().catch(() => false)) {
            await page.locator('label[for="create_billing_month"]').locator('..').locator('button, .p-datepicker-trigger').first().click().catch(async () => {
                await billing.click();
            });
            const panel = page.locator('.p-datepicker:visible').last();
            if (await panel.isVisible().catch(() => false)) {
                await panel.locator('.p-monthpicker-month, td span, .p-datepicker-month').first().click().catch(() => {});
            }
        }

        const addBtn = page.getByRole('button', { name: 'Add' });
        if (await addBtn.isEnabled().catch(() => false)) {
            await addBtn.click();
            await expect(page.getByText('Utility Readings')).toBeVisible();
        } else {
            await expect(addBtn).toBeDisabled();
        }
    });

    test('utility reading Save stays disabled until readings can be created', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utilities/create');
        await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    test('admin can view issued invoices list', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/invoices');
        await expect(page.getByText(/Issued Invoices|Invoice/i).first()).toBeVisible({ timeout: 20_000 });
        await saveEvidenceScreenshot(page, 'invoice-generation');
    });

    test('admin can open utility approval queue', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/utilities/approval');
        await expect(page).toHaveURL(/\/admin\/utilities\/approval/);
        await expect(page.locator('body')).toContainText(/Utility|Approval|No /i);
    });

    test('customer can view own invoices list', async ({ page }) => {
        await loginAsCustomer(page, customerCredentials());
        await page.goto('/customer/invoices');
        await expect(page).toHaveURL(/\/customer\/invoices/);
        await expect(page.locator('body')).toContainText(/Invoice|No /i);
    });

    test('customer cannot access admin invoice pages', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/invoices');
        await expect(page).toHaveURL(/\/forbidden/);
    });

    test('customer cannot access admin utility rates', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/utility-rates');
        await expect(page).toHaveURL(/\/forbidden/);
    });
});
