import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    fillField,
    loginAsAdmin,
    loginAsCustomer,
    selectDropdown,
} from './helpers/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const roomFile = path.join(__dirname, '.last-tb1-room');
const roomImage = path.join(__dirname, 'fixtures/pw-proof.png');

test.describe.configure({ mode: 'serial' });
test.describe('Timebox 1 — Auth & Property foundation', () => {
    test('admin can log in and open the admin dashboard', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.getByText(/dashboard/i).first()).toBeVisible();
    });

    test('customer can log in and open the customer dashboard', async ({ page }) => {
        await loginAsCustomer(page);
        await expect(page).toHaveURL(/\/customer\/dashboard/);
    });

    test('admin can create a building through the UI and see it listed', async ({ page }) => {
        const buildingName = `PW-Building-UI-${Date.now()}`;

        await loginAsAdmin(page);
        await page.goto('/admin/buildings/create');
        await page.locator('#building_name').fill(buildingName);
        await page.locator('#location').fill('Yangon');
        await page.locator('#description').fill('Created by Playwright System Test');
        await page.getByRole('button', { name: /save|create|submit/i }).first().click();

        await expect(page).toHaveURL(/\/admin\/buildings$/);
        await expect(page.getByText(buildingName)).toBeVisible({ timeout: 20_000 });
    });

    test('admin can create a room through the UI and see it listed', async ({ page }) => {
        const roomNumber = `PW-TB1-R-${Date.now()}`;

        await loginAsAdmin(page);
        await page.goto('/admin/rooms/create');
        await selectDropdown(page, 'Building', 'PW-Building-001');
        await fillField(page, 'Room Number', roomNumber);
        await fillField(page, 'Floor Number', '3');
        await fillField(page, 'Area (sqft)', '950');
        await selectDropdown(page, 'Type', 'Rent');
        await selectDropdown(page, 'Status', 'Available');
        await fillField(page, 'Rent Price (MMK)', '550000');
        await fillField(page, 'Rent Deposit (MMK)', '550000');
        const roomResponsePromise = page.waitForResponse(
            (response) => response.url().includes('/api/rooms')
                && response.request().method() === 'POST',
        );
        await page.getByRole('button', { name: /^Save$/i }).click();
        const roomResponse = await roomResponsePromise;
        if (!roomResponse.ok()) {
            throw new Error(`Room creation failed (${roomResponse.status()}): ${await roomResponse.text()}`);
        }

        await page.goto('/admin/rooms');
        await expect(page.getByText(roomNumber)).toBeVisible({ timeout: 20_000 });
        fs.writeFileSync(roomFile, roomNumber, 'utf8');
    });

    test('admin can upload a room image and see it in the room gallery', async ({ page }) => {
        const roomNumber = fs.readFileSync(roomFile, 'utf8').trim();

        await loginAsAdmin(page);
        await page.goto('/admin/rooms');
        await page.locator('tr').filter({ hasText: roomNumber }).locator('a[href$="/edit"]').click();
        await expect(page).toHaveURL(/\/admin\/rooms\/\d+\/edit$/);

        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(roomImage);
        await expect(page.locator('img[alt="Staged room image preview"]')).toBeVisible();
        await page.getByText(/Primary image/i).first().click();
        const updateResponsePromise = page.waitForResponse((response) =>
            response.request().method() === 'PUT'
            && /\/api\/rooms\/\d+$/.test(response.url()),
        );
        const uploadResponsePromise = page.waitForResponse((response) =>
            response.request().method() === 'POST'
            && response.url().includes('/api/room-images/upload'),
        );
        const addImageResponsePromise = page.waitForResponse((response) =>
            response.request().method() === 'POST'
            && response.url().endsWith('/api/room-images'),
        );
        await page.getByRole('button', { name: /^Save$/i }).click();
        for (const response of await Promise.all([
            updateResponsePromise,
            uploadResponsePromise,
            addImageResponsePromise,
        ])) {
            expect(response.ok()).toBeTruthy();
        }
        await expect(page).toHaveURL(/\/admin\/rooms$/, { timeout: 20_000 });

        await page.goto('/admin/rooms');
        await page.locator('tr').filter({ hasText: roomNumber }).locator('a').first().click();
        await expect(page).toHaveURL(/\/admin\/rooms\/\d+$/);
        await expect(page.getByText(/Image Gallery/i)).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText(/Image Gallery/i).locator('..').locator('img').first()).toBeVisible();
    });

    test('customer cannot access admin routes', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/dashboard');
        await expect(page).not.toHaveURL(/\/admin\/dashboard/);
    });
});
