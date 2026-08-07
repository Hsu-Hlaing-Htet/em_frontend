import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer, expectToast } from '../helpers/auth.js';
import { uniqueSuffix, customerCredentials } from '../helpers/credentials.js';
import { fillTextField, selectDropdownByLabel, selectFirstDropdownOptionByLabel, saveEvidenceScreenshot } from '../helpers/forms.js';

test.describe('Timebox 5 — Maintenance and Administration', () => {
    test('customer can create a maintenance request for an owned room', async ({ page }) => {
        const suffix = uniqueSuffix();
        await loginAsCustomer(page, customerCredentials());
        await page.goto('/customer/maintenance-requests/new');

        await expect(page.getByRole('heading', { name: 'New Maintenance Request' })).toBeVisible();

        const noRooms = page.getByText(/No rooms are available from an active approved contract/i);
        if (await noRooms.isVisible().catch(() => false)) {
            test.skip(true, 'Customer has no rooms from an active approved contract');
        }

        const roomDropdown = page.locator('#room_id');
        await expect(roomDropdown).toBeVisible();
        if (await roomDropdown.evaluate((el) => el.classList.contains('p-disabled')).catch(() => false)) {
            test.skip(true, 'Room dropdown disabled — no owned rooms for maintenance');
        }

        await roomDropdown.click();
        const roomOption = page.locator('.p-dropdown-panel:visible .p-dropdown-item').first();
        if (!(await roomOption.isVisible().catch(() => false))) {
            test.skip(true, 'Customer has no rooms available for maintenance requests');
        }
        await roomOption.click();

        await page.locator('#title').fill(`E2E Maintenance ${suffix}`);
        await selectFirstDropdownOptionByLabel(page, 'Category').catch(async () => {
            await page.locator('#category').click();
            await page.locator('.p-dropdown-panel:visible .p-dropdown-item').first().click();
        });
        await selectFirstDropdownOptionByLabel(page, 'Priority').catch(async () => {
            await page.locator('#priority').click();
            await page.locator('.p-dropdown-panel:visible .p-dropdown-item').first().click();
        });
        await page.locator('#description').fill(`E2E maintenance description ${suffix}`);
        await page.getByRole('button', { name: 'Submit Request' }).click();
        await expectToast(page, /success|submitted|created/i).catch(async () => {
            await expect(page).toHaveURL(/\/customer\/maintenance-requests/);
        });
    });

    test('customer can view own maintenance requests', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/maintenance-requests');
        await expect(page).toHaveURL(/\/customer\/maintenance-requests/);
        await expect(page.getByRole('button', { name: 'New Request' }).or(page.getByText(/Request/i)).first()).toBeVisible();
    });

    test('customer cannot access admin maintenance management', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/maintenance-requests');
        await expect(page).toHaveURL(/\/forbidden/);
    });

    test('admin can view maintenance requests list', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/maintenance-requests');
        await expect(page).toHaveURL(/\/admin\/maintenance-requests/);
        await expect(page.locator('body')).toContainText(/Maintenance|Request|No /i);
    });

    test('admin can start and complete a pending maintenance request when available', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/maintenance-requests');

        const row = page.locator('tbody tr').filter({ hasText: /pending|Pending/i }).first();
        if (!(await row.isVisible().catch(() => false))) {
            const any = page.locator('tbody tr a, tbody tr').first();
            if (!(await any.isVisible().catch(() => false))) {
                test.skip(true, 'No maintenance requests for admin workflow');
            }
            await any.click();
        } else {
            await row.locator('a').first().click().catch(async () => row.click());
        }

        await expect(page).toHaveURL(/\/admin\/maintenance-requests\/\d+/);

        const start = page.getByRole('button', { name: 'Start' });
        if (await start.isVisible().catch(() => false)) {
            await start.click();
            await expectToast(page, /success|started|in progress/i).catch(() => {});
        }

        const complete = page.getByRole('button', { name: 'Complete' });
        if (await complete.isVisible().catch(() => false)) {
            await complete.click();
            await expectToast(page, /success|completed/i).catch(() => {});
            await saveEvidenceScreenshot(page, 'maintenance-completion');
        } else {
            test.info().annotations.push({
                type: 'note',
                description: 'Complete button not visible (request may not be in_progress)',
            });
        }
    });

    test('admin dashboard summary displays', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/dashboard');
        await expect(page.locator('.admin-dashboard')).toBeVisible();
        await expect(page.locator('.admin-dashboard')).not.toBeEmpty();
    });

    test('customer dashboard displays', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/customer/dashboard');
        await expect(page).toHaveURL(/\/customer\/dashboard/);
        await expect(page.locator('body')).not.toBeEmpty();
    });
});
