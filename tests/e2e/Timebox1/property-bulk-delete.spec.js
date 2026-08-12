import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.js';
import { uniqueSuffix } from '../helpers/credentials.js';
import {
    cleanupPwTestBulkRecords,
    createPwTestBuilding,
    createPwTestRoom,
    loginAdminToken,
    PW_TEST_BULK_PREFIX,
} from '../helpers/pwTestPropertyApi.js';

async function confirmBulkDelete(page) {
    await page.getByRole('button', { name: 'Bulk Delete' }).click();
    await expect(page.getByText('Confirm Delete')).toBeVisible();
    await page.getByRole('button', { name: 'Yes, delete it' }).click();
}

test.describe('Property bulk delete', () => {
    test.beforeEach(async () => {
        await cleanupPwTestBulkRecords();
    });

    test.afterEach(async () => {
        await cleanupPwTestBulkRecords();
    });

    test('admin can bulk delete selected buildings', async ({ page }) => {
        const token = await loginAdminToken();
        const suffix = uniqueSuffix();
        const buildingA = await createPwTestBuilding(token, `${suffix}_A`);
        const buildingB = await createPwTestBuilding(token, `${suffix}_B`);

        await loginAsAdmin(page);
        await page.goto('/admin/buildings');

        const search = page.getByPlaceholder(/keyword search/i);
        await search.fill(PW_TEST_BULK_PREFIX);

        const rows = page.locator('tbody tr').filter({ hasText: PW_TEST_BULK_PREFIX });
        await expect(rows).toHaveCount(2, { timeout: 20_000 });
        await expect(page.getByText(buildingA.building_name).first()).toBeVisible();
        await expect(page.getByText(buildingB.building_name).first()).toBeVisible();

        await rows.nth(0).locator('.p-checkbox-input').first().click();
        await rows.nth(1).locator('.p-checkbox-input').first().click();
        await expect(page.getByText('2 selected')).toBeVisible();

        await confirmBulkDelete(page);

        await expect(page.locator('tbody')).not.toContainText(buildingA.building_name, { timeout: 20_000 });
        await expect(page.locator('tbody')).not.toContainText(buildingB.building_name);
        await expect(search).toHaveValue(PW_TEST_BULK_PREFIX);
    });

    test('admin can select all current-page rooms and bulk delete them', async ({ page }) => {
        const token = await loginAdminToken();
        const suffix = uniqueSuffix();
        const building = await createPwTestBuilding(token, `${suffix}_ROOMS`);
        const roomA = await createPwTestRoom(token, building.id, `${suffix}_A`);
        const roomB = await createPwTestRoom(token, building.id, `${suffix}_B`);

        await loginAsAdmin(page);
        await page.goto('/admin/rooms');

        const search = page.getByPlaceholder(/keyword search/i);
        await search.fill(PW_TEST_BULK_PREFIX);

        const rows = page.locator('tbody tr').filter({ hasText: PW_TEST_BULK_PREFIX });
        await expect(rows).toHaveCount(2, { timeout: 20_000 });
        await expect(page.getByText(roomA.room_number).first()).toBeVisible();
        await expect(page.getByText(roomB.room_number).first()).toBeVisible();

        await page.locator('.p-datatable-thead .p-checkbox-input').first().click();
        await expect(page.getByText('2 selected')).toBeVisible();

        await confirmBulkDelete(page);

        await expect(page.locator('tbody')).not.toContainText(roomA.room_number, { timeout: 20_000 });
        await expect(page.locator('tbody')).not.toContainText(roomB.room_number);
        await expect(search).toHaveValue(PW_TEST_BULK_PREFIX);
    });
});
