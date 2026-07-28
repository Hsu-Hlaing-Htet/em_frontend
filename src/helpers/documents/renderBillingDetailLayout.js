import {
    compactBillingValues,
    formatBillingDocumentDate,
    hasBillingValue,
} from '@/helpers/billing/billingDetailHelpers';
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
    minWidth = '44rem',
}) {
    if (!columns.length) {
        return '';
    }

    const header = columns.map((column) => `
        <th class="billing-doc-table__head ${column.align === 'right' ? 'billing-doc-table__numeric' : ''}">
            ${escapeHtml(column.label)}
        </th>
    `).join('');

    const body = rows.length
        ? rows.map((row) => `
            <tr>
                ${columns.map((column) => {
                    const raw = row[column.key];
                    const value = hasBillingValue(raw) ? raw : '';

                    return `
                        <td class="billing-doc-table__cell ${column.align === 'right' ? 'billing-doc-table__numeric' : ''}">
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

    return `
        <div class="billing-doc-divider"></div>
        <div class="billing-doc-table-wrap">
            <table class="billing-doc-table" style="min-width: ${minWidth};">
                <thead>
                    <tr>${header}</tr>
                </thead>
                <tbody>${body}</tbody>
                ${footer}
            </table>
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
    summaryNote = '',
}) {
    const tableHtml = tables.map((table) => renderBillingTableSection(table)).join('');

    return `
        <section class="billing-doc-body">
            ${renderBillingCustomerSection(customerInfo)}
            ${tableHtml}
            ${renderBillingSummaryNote(summaryNote)}
        </section>
    `;
}
