import { expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fixturesDir = path.join(__dirname, '..', 'fixtures');

export function fixturePath(name) {
    return path.join(fixturesDir, name);
}

/** Locate a .field block by its label text. */
export function fieldByLabel(page, label) {
    return page.locator('.field').filter({ has: page.locator('label', { hasText: new RegExp(`^${escapeRegExp(label)}$`) }) }).first();
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Prefer labeled containers; fall back to non-.field wrappers used on customer pages. */
export function fieldOrSectionByLabel(page, label) {
    const field = fieldByLabel(page, label);
    return field.or(
        page.locator('div').filter({ has: page.locator(`label:text-is("${label}")`) }).first(),
    );
}

export async function fillTextField(page, label, value) {
    const field = fieldByLabel(page, label);
    const input = field.locator('input, textarea').first();
    await input.fill(String(value));
}

export async function fillInputNumberField(page, label, value) {
    const field = fieldByLabel(page, label);
    const input = field.locator('input').first();
    await input.click();
    await input.fill('');
    await input.fill(String(value));
    await input.blur();
}

/**
 * Open a PrimeVue Dropdown inside a labeled field and pick an option by visible text.
 */
export async function selectDropdownByLabel(page, label, optionText) {
    const field = fieldByLabel(page, label);
    const dropdown = field.locator('.p-dropdown');
    if (await dropdown.count()) {
        await dropdown.click();
    } else {
        await page.locator(`label:text-is("${label}")`).locator('..').locator('.p-dropdown').click();
    }
    const panel = page.locator('.p-dropdown-panel:visible').last();
    await expect(panel).toBeVisible();
    if (optionText instanceof RegExp) {
        await panel.locator('.p-dropdown-item').filter({ hasText: optionText }).first().click();
    } else {
        await panel.locator('.p-dropdown-item').filter({ hasText: optionText }).first().click();
    }
}

export async function selectFirstDropdownOptionByLabel(page, label) {
    const field = fieldByLabel(page, label);
    let dropdown = field.locator('.p-dropdown');
    if (!(await dropdown.count())) {
        dropdown = page.locator(`label:text-is("${label}")`).locator('xpath=..').locator('.p-dropdown');
    }
    await dropdown.first().click();
    const panel = page.locator('.p-dropdown-panel:visible').last();
    await expect(panel).toBeVisible();
    const item = panel.locator('.p-dropdown-item').first();
    await expect(item).toBeVisible();
    const text = (await item.innerText()).trim();
    await item.click();
    return text;
}

export async function pickCalendarDateByLabel(page, label, { year = '1995', monthLabel = 'January', day = '15' } = {}) {
    const field = fieldByLabel(page, label).or(
        page.locator('div').filter({ has: page.locator(`label:text-is("${label}")`) }).first(),
    );
    await field.locator('button.p-datepicker-trigger, .p-datepicker-trigger, button[aria-label="Choose Date"]').first().click();
    const panel = page.locator('.p-datepicker:visible').last();
    await expect(panel).toBeVisible();
    // Navigate year/month if controls exist; otherwise click a day cell.
    const dayCell = panel.locator('td:not(.p-datepicker-other-month) span').filter({ hasText: new RegExp(`^${day}$`) }).first();
    if (await dayCell.isVisible().catch(() => false)) {
        await dayCell.click();
        return;
    }
    await panel.locator('td span').filter({ hasText: new RegExp(`^${day}$`) }).first().click();
}

/**
 * Open dropdown by its placeholder text (when label alone is ambiguous).
 */
export async function selectDropdownByPlaceholder(page, placeholder, optionText) {
    await page.locator(`.p-dropdown:has-text("${placeholder}"), .p-dropdown`).filter({
        has: page.getByText(placeholder, { exact: true }),
    }).first().click().catch(async () => {
        await page.getByText(placeholder, { exact: true }).click();
    });

    const panel = page.locator('.p-dropdown-panel:visible').last();
    await expect(panel).toBeVisible();
    await panel.locator('.p-dropdown-item').filter({ hasText: optionText }).first().click();
}

export async function saveEvidenceScreenshot(page, name) {
    const dest = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'docs',
        'testing',
        'playwright',
        'screenshots',
        `${name}.png`,
    );
    await page.screenshot({ path: dest, fullPage: true });
}
