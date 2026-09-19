import { COMPANY_INFO } from './companyInfo';
import { escapeHtml } from './htmlUtils';
import { formatCurrency } from './billingDocumentHelpers';
import { formatBillingDocumentDate } from './renderBillingDetailLayout';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';
import documentFontStyles from '@/assets/css/documents/document-font.css?inline';
import invoiceDocumentStyles from '@/assets/css/documents/invoice-document.css?inline';

function cell(value) {
    return escapeHtml(value ?? '—');
}

export function renderInvoiceDocumentBody(document) {
    if (!document) {
        return '';
    }

    const items = document.items || [];
    const rowsHtml = items.length
        ? items.map((row) => `
            <tr>
                <td>${cell(row.description)}</td>
                <td class="is-center">${cell(row.previous_reading)}</td>
                <td class="is-center">${cell(row.current_reading)}</td>
                <td class="is-center">${cell(row.usage)}</td>
                <td class="is-num">${cell(row.unit_price)}</td>
                <td class="is-num">${cell(row.amount)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="6">No line items recorded.</td></tr>`;
    const overdueDays = Number(document.totals?.overdue_days || 0);
    const overdueRowHtml = overdueDays > 0
        ? `
                <div class="invoice-doc__totals-row">
                    <span>Overdue Days</span>
                    <span>${cell(`${overdueDays} days`)}</span>
                </div>
        `
        : '';

    return `
        <div class="invoice-doc__intro">
            <div class="invoice-doc__intro-left">
                <section>
                    <p class="invoice-doc__block-label">Bill To</p>
                    <p class="invoice-doc__block-name">${cell(document.billTo?.name)}</p>
                    <p class="invoice-doc__block-line">${cell(document.billTo?.email)}</p>
                    <p class="invoice-doc__block-line">${cell(document.billTo?.phone)}</p>
                </section>

                <section>
                    <p class="invoice-doc__block-label">Property</p>
                    <p class="invoice-doc__block-name">${cell(document.property?.building)}</p>
                    <p class="invoice-doc__block-line">${
                        !document.property?.room || document.property.room === '—'
                            ? '—'
                            : `Unit ${cell(document.property.room)}`
                    }</p>
                </section>
            </div>

            <aside class="invoice-doc__summary">
                <div class="invoice-doc__summary-row">
                    <span class="invoice-doc__summary-label">Invoice No.</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.invoice_number)}</span>
                </div>
                <div class="invoice-doc__summary-row">
                    <span class="invoice-doc__summary-label">Issue Date</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.issue_date)}</span>
                </div>
                <div class="invoice-doc__summary-row">
                    <span class="invoice-doc__summary-label">Due Date</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.due_date)}</span>
                </div>
                <div class="invoice-doc__summary-row">
                    <span class="invoice-doc__summary-label">Billing Period</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.billing_period)}</span>
                </div>
                <div class="invoice-doc__summary-row">
                    <span class="invoice-doc__summary-label">Status</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.status)}</span>
                </div>
                <div class="invoice-doc__summary-row invoice-doc__summary-row--due">
                    <span class="invoice-doc__summary-label">Amount Due</span>
                    <span class="invoice-doc__summary-value">${cell(document.summary?.amount_due)}</span>
                </div>
            </aside>
        </div>

        <div class="invoice-doc__table-wrap">
            <table class="invoice-doc__table">
                <thead>
                    <tr>
                        <th class="invoice-doc__col-desc">Description</th>
                        <th class="invoice-doc__col-meter is-center">Previous Unit</th>
                        <th class="invoice-doc__col-meter is-center">Current Unit</th>
                        <th class="invoice-doc__col-meter is-center">Usage</th>
                        <th class="invoice-doc__col-price is-num">Unit Price</th>
                        <th class="invoice-doc__col-amount is-num">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>

        <div class="invoice-doc__after">
            <section class="invoice-doc__notes">
                <p class="invoice-doc__notes-title">Notes</p>
                <p>${escapeHtml(document.notes || '')}</p>
            </section>

            <div class="invoice-doc__totals">
                <div class="invoice-doc__totals-row">
                    <span>Subtotal</span>
                    <span>${cell(document.totals?.subtotal)}</span>
                </div>
                ${overdueRowHtml}
                <div class="invoice-doc__totals-row">
                    <span>Late Fee</span>
                    <span>${cell(document.totals?.late_fee)}</span>
                </div>
                <div class="invoice-doc__totals-row invoice-doc__totals-row--due">
                    <span>Amount Due</span>
                    <span>${cell(document.totals?.amount_due)}</span>
                </div>
            </div>
        </div>
    `;
}

export function renderInvoiceDocumentLead() {
    return '';
}

export function renderInvoiceDocumentArticle(document, logoSrc) {
    if (!document) {
        return '';
    }

    const company = document.company || COMPANY_INFO;

    return `
        <article id="pdf-print" class="invoice-doc">
            <header class="invoice-doc__head">
                <div class="invoice-doc__brand">
                    ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Rosewood Royale" class="invoice-doc__logo">` : ''}
                    <div>
                        <p class="invoice-doc__company">${escapeHtml(company.name || COMPANY_INFO.name)}</p>
                        <p class="invoice-doc__company-sub">${escapeHtml(company.tagline || COMPANY_INFO.tagline)}</p>
                    </div>
                </div>
                <h1 class="invoice-doc__title">${escapeHtml(document.title || 'INVOICE')}</h1>
            </header>

            ${renderInvoiceDocumentBody(document)}

            <footer class="invoice-doc__foot">
                <div class="invoice-doc__foot-company">
                    <strong>${escapeHtml(company.name || COMPANY_INFO.name)}</strong>
                    <span>${escapeHtml(company.address || COMPANY_INFO.address)}</span><br>
                    <span>${escapeHtml(company.phone || COMPANY_INFO.phone)} · ${escapeHtml(company.email || COMPANY_INFO.email)}</span><br>
                    <span>${escapeHtml(company.website || COMPANY_INFO.website || '')}</span>
                </div>
                <div class="invoice-doc__foot-confidential">
                    <span class="invoice-doc__foot-confidential-label">Confidential</span>
                    <span>${escapeHtml(document.confidentialNotice || 'This invoice is intended solely for the named recipient.')}</span>
                </div>
                <div class="invoice-doc__foot-page">Page 1 of 1</div>
            </footer>
        </article>
    `;
}

export function renderInvoiceDocumentHtmlPage(document, logoSrc) {
    const invoiceNo = document?.summary?.invoice_number
        || document?.header?.referenceNo
        || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(invoiceNo)}</title>
    <style>${documentFontStyles}\n${invoiceDocumentStyles}</style>
</head>
<body class="invoice-doc-body">
    ${renderInvoiceDocumentArticle(document, logoSrc)}
</body>
</html>`;
}

export function buildInvoiceCustomerInfo(state) {
    return {
        name: state.customer_name,
        lines: [
            state.customer_email,
            state.customer_phone,
            state.customer_address,
            state.building_name,
            state.room_number,
        ].filter((value) => hasBillingValue(value)),
        issuedDate: formatBillingDocumentDate(state.issued_date || state.created_at),
    };
}

export function buildInvoiceSummaryNote(state) {
    const parts = [];

    if (hasBillingValue(state.notes)) {
        parts.push(state.notes);
    }

    parts.push('Please settle this invoice by the due date. Late fees may apply after the due date.');

    return parts.join(' ');
}

export { formatBillingDocumentDate, formatCurrency, invoiceDocumentStyles };
