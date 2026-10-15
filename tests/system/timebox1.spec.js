import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from './helpers/auth.js';

test.describe('Timebox 1 — Auth & Property foundation', () => {
    test('admin can log in and open the admin dashboard', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.getByText(/dashboard/i).first()).toBeVisible();
    });

    test('admin can create a building through the UI and see it listed', async ({ page }) => {
        const buildingName = `PW-Building-UI-${Date.now()}`;

        await loginAsAdmin(page);
        await page.goto('/admin/buildings/create');
        await page.locator('#building_name').fill(buildingName);
        await page.locator('#location').fill('Yangon');
        await page.locator('#description').fill('Created by Playwright System Test');
        await page.getByRole('button', { name: /save|create|submit/i }).first().click();

        await page.goto('/admin/buildings');
        await expect(page.getByText(buildingName)).toBeVisible({ timeout: 20_000 });
    });

    test('customer cannot access admin routes', async ({ page }) => {
        await loginAsCustomer(page);
        await page.goto('/admin/dashboard');
        await expect(page).not.toHaveURL(/\/admin\/dashboard/);
    });
});
