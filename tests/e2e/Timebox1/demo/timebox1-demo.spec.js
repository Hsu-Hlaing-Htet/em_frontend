import { test, expect } from '@playwright/test';
import {
    fillLoginForm,
    submitLogin,
    loginAsAdmin,
    loginAsCustomer,
    expectToast,
} from '../../helpers/auth.js';
import { adminCredentials } from '../../helpers/credentials.js';
import {
    fillTextField,
    fillInputNumberField,
    selectDropdownByLabel,
    fixturePath,
} from '../../helpers/forms.js';
import { PW_TB1, cleanupPwTb1Records } from '../../helpers/pwTb1Cleanup.js';

test.describe.configure({ mode: 'serial' });

test.describe('Timebox 1 Demo — visible property workflow', () => {
    test.beforeAll(async () => {
        // Remove leftover PW_TB1 data from a previous interrupted demo.
        await cleanupPwTb1Records();
    });

    test.afterAll(async () => {
        // Also clean here so cleanup runs even if globalTeardown is skipped in some runners.
        await cleanupPwTb1Records();
    });

    test('invalid login shows error and stays on login page', async ({ page }) => {
        await fillLoginForm(page, {
            email: 'not-a-user@example.com',
            password: 'wrong-password',
        });
        await submitLogin(page);

        await expect(page).toHaveURL(/\/login/);
        await expectToast(page, 'Login Failed');
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('valid admin login shows admin dashboard', async ({ page }) => {
        const credentials = adminCredentials();
        await fillLoginForm(page, credentials);
        await submitLogin(page);

        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.locator('.admin-dashboard')).toBeVisible({ timeout: 30_000 });
        await expectToast(page, 'Login successful.');
    });

    test('building create shows validation when required fields are empty', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/buildings/create');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.locator('.p-error').first()).toBeVisible({ timeout: 20_000 });
        await expect(page).toHaveURL(/\/admin\/buildings\/create/);
    });

    test('admin creates PW_TB1_BUILDING and sees it in the list', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/buildings');
        await page.getByRole('link', { name: 'Create' }).or(page.getByRole('button', { name: 'Create' })).first().click();
        await expect(page).toHaveURL(/\/admin\/buildings\/create/);

        await page.locator('#building_name').fill(PW_TB1.buildingName);
        await page.locator('#location').fill(PW_TB1.location);
        await page.locator('#description').fill('Temporary Playwright Timebox 1 demo building');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page).toHaveURL(/\/admin\/buildings\/?$/);
        await expectToast(page, /Building created successfully|created successfully/i);
        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.buildingName);
        await expect(page.getByText(PW_TB1.buildingName).first()).toBeVisible({ timeout: 30_000 });
    });

    test('admin updates PW_TB1_BUILDING location', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/buildings');
        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.buildingName);
        await expect(page.getByText(PW_TB1.buildingName).first()).toBeVisible({ timeout: 30_000 });

        const row = page.locator('tr').filter({ hasText: PW_TB1.buildingName }).first();
        await row.locator('a[href*="/edit"]').first().click();
        await expect(page).toHaveURL(/\/edit/);

        await page.locator('#location').fill(PW_TB1.updatedLocation);
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page).toHaveURL(/\/admin\/buildings\/?$/, { timeout: 30_000 });

        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.buildingName);
        await expect(page.getByText(PW_TB1.updatedLocation).first()).toBeVisible({ timeout: 30_000 });
    });

    test('room create shows validation when required fields are empty', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rooms/create');
        await page.getByRole('button', { name: 'Save Room' }).click();
        await expect(page.locator('.p-error').first()).toBeVisible({ timeout: 20_000 });
        await expect(page).toHaveURL(/\/admin\/rooms\/create/);
    });

    test('admin creates PW_TB1_ROOM_101 under PW_TB1_BUILDING', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rooms/create');

        await selectDropdownByLabel(page, 'Building', PW_TB1.buildingName);
        await fillTextField(page, 'Room Number', PW_TB1.roomNumber);
        await fillInputNumberField(page, 'Floor Number', 1);
        await fillInputNumberField(page, 'Area (sqft)', 500);
        await fillInputNumberField(page, 'Sale Price (MMK)', 10000000);
        await fillInputNumberField(page, 'Rent Price (MMK)', 500000);
        await fillInputNumberField(page, 'Rent Deposit (MMK)', 500000);
        await fillInputNumberField(page, 'Booking Deposit (MMK)', 100000);

        await page.getByRole('button', { name: 'Save Room' }).click();
        await expectToast(page, /Room created successfully|created successfully/i);
        await expect(page).toHaveURL(/\/admin\/rooms\/?$/);

        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.roomNumber);
        await expect(page.getByText(PW_TB1.roomNumber).first()).toBeVisible({ timeout: 30_000 });
        await expect(page.getByText(PW_TB1.buildingName).first()).toBeVisible();
    });

    test('admin updates PW_TB1_ROOM_101 floor number', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rooms');
        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.roomNumber);
        await expect(page.getByText(PW_TB1.roomNumber).first()).toBeVisible({ timeout: 30_000 });

        await page.locator('tr').filter({ hasText: PW_TB1.roomNumber }).locator('a[href*="/edit"]').first().click();
        await expect(page).toHaveURL(/\/edit/);

        await fillInputNumberField(page, 'Floor Number', 3);
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page).toHaveURL(/\/admin\/rooms\/?$/, { timeout: 30_000 });

        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.roomNumber);
        await page.locator('tr').filter({ hasText: PW_TB1.roomNumber }).locator('a[href*="/edit"]').first().click();
        await expect(
            page.locator('.field').filter({ has: page.locator('label', { hasText: /^Floor Number$/ }) }).locator('input').first(),
        ).toHaveValue('3');
    });

    test('admin uploads a room image for PW_TB1_ROOM_101', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/rooms');
        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.roomNumber);
        await expect(page.getByText(PW_TB1.roomNumber).first()).toBeVisible({ timeout: 30_000 });

        await page.locator('tr').filter({ hasText: PW_TB1.roomNumber }).locator('a[href*="/edit"]').first().click();
        await expect(page).toHaveURL(/\/edit/);

        const fileInput = page.locator('input[type="file"][accept*="image"]').first();
        await fileInput.setInputFiles(fixturePath('valid-room-image.jpg'));
        await expect(page.getByAltText(/Staged room image preview|Room image preview/i).first()).toBeVisible({
            timeout: 20_000,
        });

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page).toHaveURL(/\/admin\/rooms\/?$/, { timeout: 30_000 });

        await page.getByPlaceholder(/keyword search/i).fill(PW_TB1.roomNumber);
        await page.locator('tr').filter({ hasText: PW_TB1.roomNumber }).locator('a[href*="/edit"]').first().click();
        await expect(page.getByAltText(/Room image preview/i).first()).toBeVisible({ timeout: 30_000 });
    });

    test('customer cannot access admin property pages', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/buildings');
        await expect(page).toHaveURL(/\/forbidden/);
        await expect(page.getByText(/Access forbidden/i)).toBeVisible();
    });

    test('admin logout returns to login page', async ({ page }) => {
        await loginAsAdmin(page);
        await expect(page).toHaveURL(/\/admin\/dashboard/);

        // Open profile menu in the topbar, then Logout
        await page.getByRole('button', { name: /super_admin|Admin User|Kyaw Swar/i }).first().click();
        await page.getByText('Logout', { exact: true }).click();
        await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});
