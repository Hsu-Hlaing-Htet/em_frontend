import {
    compactBillingValues,
    formatBillingDocumentDate,
    hasBillingValue,
} from '@/helpers/billing/billingDetailHelpers';
import { buildDocumentAuthorizationRows } from './billingDocumentContent';
import { escapeHtml } from './htmlUtils';

export { formatBillingDocumentDate };

export function renderBillingCustomerSection(customerInfo = {}) {
    const lines = compactBillingValues(customerInfo.lines || []);
    const name = hasBillingValue(customerInfo.name) ? customerInfo.name : '';
    const date = hasBillingValue(customerInfo.issuedDate) ? customerInfo.issuedDate : '';

    if (!name && !lines.length && !date) {
        return '';
    }

    const lineHtml = lines.map((line, index) => `
        <div class="billing-doc-customer__line ${index === 0 && !name ? 'billing-doc-customer__line--first' : ''} ${String(line).includes('@') ? 'billing-doc-customer__line--wrap' : ''}">
            ${escapeHtml(line)}
        </div>
    `).join('');

    return `
        <div class="billing-doc-customer">
            <div class="billing-doc-customer__content">
                ${name ? `<div class="billing-doc-customer__name">${escapeHtml(name)}</div>` : ''}
                ${lineHtml}
            </div>
            ${date ? `<div class="billing-doc-customer__date">${escapeHtml(date)}</div>` : ''}
        </div>
    `;
}

export function renderBillingTableSection({
    columns = [],
    rows = [],
    emptyMessage = 'No records found.',
    totalLabel = 'Total',
    totalValue = '',
    minWidth = '100%',
    rowspanKeys = [],
    tableClass = '',
    wrapClass = '',
    fixedLayout = false,
}) {
    if (!columns.length) {
        return '';
    }

    const rowspanKeySet = new Set(rowspanKeys);
    const hasColumnWidths = columns.some((column) => column.width);
    const colgroup = hasColumnWidths
        ? `<colgroup>${columns.map((column) => (
            `<col style="width: ${escapeHtml(column.width || 'auto')};">`
        )).join('')}</colgroup>`
        : '';
    const header = columns.map((column) => `
        <th class="billing-doc-table__head ${column.align === 'right' ? 'billing-doc-table__numeric' : ''}">
            ${escapeHtml(column.label)}
        </th>
    `).join('');

    const body = rows.length
        ? rows.map((row, rowIndex) => `
            <tr>
                ${columns.map((column) => {
                    if (rowspanKeySet.has(column.key) && rowIndex > 0) {
                        return '';
                    }

                    const raw = row[column.key];
                    const value = (raw === '—' || raw === '–' || raw === '-')
                        ? raw
                        : (hasBillingValue(raw) ? raw : '');
                    const rowspanAttr = rowspanKeySet.has(column.key) && rows.length > 1
                        ? ` rowspan="${rows.length}"`
                        : '';

                    return `
                        <td class="billing-doc-table__cell ${column.align === 'right' ? 'billing-doc-table__numeric' : ''}"${rowspanAttr}>
                            ${escapeHtml(value)}
                        </td>
                    `;
                }).join('')}
            </tr>
        `).join('')
        : `
            <tr>
                <td colspan="${columns.length}" class="billing-doc-table__empty">
                    ${escapeHtml(emptyMessage)}
                </td>
            </tr>
        `;

    const footer = rows.length && hasBillingValue(totalValue)
        ? `
            <tfoot>
                <tr>
                    <td colspan="${Math.max(columns.length - 1, 1)}" class="billing-doc-table__total-label">
                        ${escapeHtml(totalLabel)}
                    </td>
                    <td class="billing-doc-table__numeric billing-doc-table__total-value">
                        ${escapeHtml(totalValue)}
                    </td>
                </tr>
            </tfoot>
        `
        : '';

    const tableStyles = fixedLayout
        ? 'width: 100%; table-layout: fixed; min-width: 0;'
        : `min-width: ${minWidth}; width: 100%;`;

    return `
        <div class="billing-doc-divider"></div>
        <div class="billing-doc-table-wrap ${escapeHtml(wrapClass)}">
            <table class="billing-doc-table ${escapeHtml(tableClass)}" style="${tableStyles}">
                ${colgroup}
                <thead>
                    <tr>${header}</tr>
                </thead>
                <tbody>${body}</tbody>
                ${footer}
            </table>
        </div>
    `;
}

export function renderBillingAmountSummary(rows = []) {
    const visible = rows.filter((row) => hasBillingValue(row?.value));

    if (!visible.length) {
        return '';
    }

    return `
        <div class="billing-doc-divider"></div>
        <div class="billing-doc-amounts">
            ${visible.map((row) => `
                <div class="billing-doc-amounts__row">
                    <span class="billing-doc-amounts__label">${escapeHtml(row.label)}</span>
                    <span class="billing-doc-amounts__value">${escapeHtml(row.value)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

export function renderBillingAuthorizationSection(authorization = {}) {
    const rows = buildDocumentAuthorizationRows(authorization);

    if (!rows.length) {
        return '';
    }

    return `
        <div class="billing-doc-divider"></div>
        <div class="billing-doc-authorization">
            ${rows.map((row) => `
                <div class="billing-doc-authorization__row">
                    <span class="billing-doc-authorization__label">${escapeHtml(row.label)}</span>
                    <span class="billing-doc-authorization__value">${escapeHtml(row.value)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

export function renderBillingSummaryNote(note) {
    if (!hasBillingValue(note)) {
        return '';
    }

    return `<p class="billing-doc-summary">${escapeHtml(note)}</p>`;
}

export function renderBillingDocumentBody({
    customerInfo,
    tables = [],
    amountSummary = [],
    authorization = null,
    summaryNote = '',
}) {
    const tableHtml = tables.map((table) => renderBillingTableSection(table)).join('');

    return `
        <section class="billing-doc-body">
            ${renderBillingCustomerSection(customerInfo)}
            ${tableHtml}
            ${renderBillingAmountSummary(amountSummary)}
            ${renderBillingAuthorizationSection(authorization)}
            ${renderBillingSummaryNote(summaryNote)}
        </section>
    `;
}
