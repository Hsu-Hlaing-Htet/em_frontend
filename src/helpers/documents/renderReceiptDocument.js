import { COMPANY_INFO } from './companyInfo';
import { escapeHtml } from './htmlUtils';
import receiptDocumentStyles from '@/assets/css/documents/receipt-document.css?inline';
import {
    buildReceiptCustomerInfo,
    buildReceiptSummaryNote,
} from '@/helpers/receipts/receiptDetailHelpers';

function cell(value) {
    return escapeHtml(value ?? '—');
}

export function renderReceiptDocumentBody(document) {
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

    return `
        <div class="receipt-doc__intro">
            <div class="receipt-doc__intro-left">
                <section>
                    <p class="receipt-doc__block-label">Bill To</p>
                    <p class="receipt-doc__block-name">${cell(document.billTo?.name)}</p>
                    <p class="receipt-doc__block-line">${cell(document.billTo?.email)}</p>
                    <p class="receipt-doc__block-line">${cell(document.billTo?.phone)}</p>
                </section>

                <section>
                    <p class="receipt-doc__block-label">Property</p>
                    <p class="receipt-doc__block-name">${cell(document.property?.building)}</p>
                    <p class="receipt-doc__block-line">${
                        !document.property?.room || document.property.room === '—'
                            ? '—'
                            : `Unit ${cell(document.property.room)}`
                    }</p>
                </section>
            </div>

            <aside class="receipt-doc__summary">
                <div class="receipt-doc__summary-row">
                    <span class="receipt-doc__summary-label">Receipt No.</span>
                    <span class="receipt-doc__summary-value">${cell(document.summary?.receipt_number)}</span>
                </div>
                <div class="receipt-doc__summary-row">
                    <span class="receipt-doc__summary-label">Issue Date</span>
                    <span class="receipt-doc__summary-value">${cell(document.summary?.issue_date)}</span>
                </div>
                <div class="receipt-doc__summary-row">
                    <span class="receipt-doc__summary-label">Invoice No.</span>
                    <span class="receipt-doc__summary-value">${cell(document.summary?.invoice_number)}</span>
                </div>
                <div class="receipt-doc__summary-row">
                    <span class="receipt-doc__summary-label">Payment Date</span>
                    <span class="receipt-doc__summary-value">${cell(document.summary?.payment_date)}</span>
                </div>
                <div class="receipt-doc__summary-row receipt-doc__summary-row--due">
                    <span class="receipt-doc__summary-label">Amount Received</span>
                    <span class="receipt-doc__summary-value">${cell(document.summary?.amount_received)}</span>
                </div>
            </aside>
        </div>

        <div class="receipt-doc__table-wrap">
            <table class="receipt-doc__table">
                <thead>
                    <tr>
                        <th class="receipt-doc__col-desc">Description</th>
                        <th class="receipt-doc__col-meter is-center">Previous Unit</th>
                        <th class="receipt-doc__col-meter is-center">Current Unit</th>
                        <th class="receipt-doc__col-meter is-center">Usage</th>
                        <th class="receipt-doc__col-price is-num">Unit Price</th>
                        <th class="receipt-doc__col-amount is-num">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>

        <div class="receipt-doc__after">
            <section class="receipt-doc__notes">
                <p class="receipt-doc__notes-title">Notes</p>
                <p>${escapeHtml(document.notes || '')}</p>
            </section>

            <div class="receipt-doc__totals">
                <div class="receipt-doc__totals-row">
                    <span>Invoice Total</span>
                    <span>${cell(document.totals?.invoice_total)}</span>
                </div>
                <div class="receipt-doc__totals-row">
                    <span>Amount Received</span>
                    <span>${cell(document.totals?.amount_received)}</span>
                </div>
                <div class="receipt-doc__totals-row receipt-doc__totals-row--due">
                    <span>Balance</span>
                    <span>${cell(document.totals?.balance)}</span>
                </div>
            </div>
        </div>
    `;
}

export function renderReceiptDocumentLead() {
    return '';
}

export function renderReceiptDocumentArticle(document, logoSrc) {
    if (!document) {
        return '';
    }

    const company = document.company || COMPANY_INFO;

    return `
        <article id="pdf-print" class="receipt-doc">
            <header class="receipt-doc__head">
                <div class="receipt-doc__brand">
                    ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Rosewood Royale" class="receipt-doc__logo">` : ''}
                    <div>
                        <p class="receipt-doc__company">${escapeHtml(company.name || COMPANY_INFO.name)}</p>
                        <p class="receipt-doc__company-sub">${escapeHtml(company.tagline || COMPANY_INFO.tagline)}</p>
                    </div>
                </div>
                <h1 class="receipt-doc__title">${escapeHtml(document.title || 'RECEIPT')}</h1>
            </header>

            ${renderReceiptDocumentBody(document)}

            <footer class="receipt-doc__foot">
                <div class="receipt-doc__foot-company">
                    <strong>${escapeHtml(company.name || COMPANY_INFO.name)}</strong>
                    <span>${escapeHtml(company.address || COMPANY_INFO.address)}</span><br>
                    <span>${escapeHtml(company.phone || COMPANY_INFO.phone)} · ${escapeHtml(company.email || COMPANY_INFO.email)}</span><br>
                    <span>${escapeHtml(company.website || COMPANY_INFO.website || '')}</span>
                </div>
                <div class="receipt-doc__foot-confidential">
                    <span class="receipt-doc__foot-confidential-label">Confidential</span>
                    <span>${escapeHtml(document.confidentialNotice || 'This receipt is intended solely for the named recipient.')}</span>
                </div>
                <div class="receipt-doc__foot-page">Page 1 of 1</div>
            </footer>
        </article>
    `;
}

export function renderReceiptDocumentHtmlPage(document, logoSrc) {
    const receiptNo = document?.summary?.receipt_number
        || document?.header?.referenceNo
        || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Receipt ${escapeHtml(receiptNo)}</title>
    <style>${receiptDocumentStyles}</style>
</head>
<body class="receipt-doc-body">
    ${renderReceiptDocumentArticle(document, logoSrc)}
</body>
</html>`;
}

export { buildReceiptCustomerInfo, buildReceiptSummaryNote, receiptDocumentStyles };
