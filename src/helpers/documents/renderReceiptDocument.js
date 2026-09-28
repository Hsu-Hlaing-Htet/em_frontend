import { COMPANY_INFO } from './companyInfo';
import { escapeHtml } from './htmlUtils';
import documentFontStyles from '@/assets/css/documents/document-font.css?inline';
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

    const items = Array.isArray(document.items) ? document.items : [];
    const itemRows = items.length
        ? items.map((item) => `
            <tr>
                <td>${cell(item.description)}</td>
                <td class="is-num">${cell(item.amount)}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="2">No charges recorded.</td></tr>';

    const settlementRow = document.totals?.show_change
        ? `
            <div class="receipt-doc__totals-row receipt-doc__totals-row--due">
                <span>Change</span>
                <span>${cell(document.totals?.change)}</span>
            </div>
        `
        : `
            <div class="receipt-doc__totals-row receipt-doc__totals-row--due">
                <span>Balance</span>
                <span>${cell(document.totals?.balance)}</span>
            </div>
        `;

    return `
        <section class="receipt-doc__info">
            <div class="receipt-doc__info-col">
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Customer Name</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.customer_name)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Building</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.building)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Room</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.room)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Paid By</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.paid_by)}</span>
                </div>
            </div>
            <div class="receipt-doc__info-col">
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Invoice No.</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.invoice_number)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Approved By</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.approved_by)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Payment Method</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.payment_method)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Payment Date</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.payment_date)}</span>
                </div>
            </div>
        </section>

        <div class="receipt-doc__table-wrap">
            <table class="receipt-doc__table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="is-num">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                </tbody>
            </table>
        </div>

        <div class="receipt-doc__totals">
            <div class="receipt-doc__totals-row">
                <span>Subtotal</span>
                <span>${cell(document.totals?.subtotal)}</span>
            </div>
            <div class="receipt-doc__totals-row">
                <span>Late Fee</span>
                <span>${cell(document.totals?.late_fee)}</span>
            </div>
            <div class="receipt-doc__totals-row receipt-doc__totals-row--section">
                <span>Total</span>
                <span>${cell(document.totals?.total)}</span>
            </div>
            <div class="receipt-doc__totals-row">
                <span>Paid</span>
                <span>${cell(document.totals?.paid)}</span>
            </div>
            ${settlementRow}
        </div>

        <section class="receipt-doc__confirmation">
            ${renderLateFeeNotes(document.late_fee_notes)}
            <p class="receipt-doc__confirmation-title">${cell(document.confirmation?.title || 'Payment received successfully.')}</p>
            <p class="receipt-doc__confirmation-message">${cell(document.confirmation?.message || 'This receipt confirms that the payment has been recorded successfully.')}</p>
        </section>
    `;
}

function renderLateFeeNotes(notes) {
    if (!notes?.rule || !Array.isArray(notes.calculation) || notes.calculation.length === 0) {
        return '';
    }

    const calcLines = notes.calculation
        .map((line) => `<p class="receipt-doc__late-fee-line">${cell(line)}</p>`)
        .join('');

    return `
        <div class="receipt-doc__late-fee">
            <p class="receipt-doc__late-fee-label">Late Fee Rule</p>
            <p class="receipt-doc__late-fee-line">${cell(notes.rule)}</p>
            <p class="receipt-doc__late-fee-label receipt-doc__late-fee-label--calc">Calculation</p>
            ${calcLines}
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
                <div class="receipt-doc__head-meta">
                    <div class="receipt-doc__head-meta-row">
                        <span class="receipt-doc__head-meta-label">Receipt No.</span>
                        <span class="receipt-doc__head-meta-value">${cell(document.header?.receipt_number)}</span>
                    </div>
                    <div class="receipt-doc__head-meta-row">
                        <span class="receipt-doc__head-meta-label">Date</span>
                        <span class="receipt-doc__head-meta-value">${cell(document.header?.date)}</span>
                    </div>
                </div>
            </header>

            <section class="receipt-doc__title-block">
                <h1 class="receipt-doc__title">${escapeHtml(document.title || 'PAYMENT RECEIPT')}</h1>
                <p class="receipt-doc__subtitle">${escapeHtml(document.subtitle || 'THANK YOU FOR YOUR PAYMENT')}</p>
            </section>

            ${renderReceiptDocumentBody(document)}

            <footer class="receipt-doc__foot">
                <div class="receipt-doc__foot-company">
                    <strong>${escapeHtml(company.name || COMPANY_INFO.name)}</strong>
                    <span>${escapeHtml(company.address || COMPANY_INFO.address)}</span><br>
                    <span>${escapeHtml(company.phone || COMPANY_INFO.phone)}</span><br>
                    <span>${escapeHtml(company.email || COMPANY_INFO.email)}</span>
                </div>
                <div class="receipt-doc__foot-confidential">
                    <span class="receipt-doc__foot-confidential-label">Confidential</span>
                    <span>${escapeHtml(document.footer?.confidential_notice || 'System-generated receipt · No signature required')}</span>
                </div>
            </footer>
        </article>
    `;
}

export function renderReceiptDocumentHtmlPage(document, logoSrc) {
    const receiptNo = document?.header?.receipt_number
        || document?.info?.receipt_number
        || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Receipt ${escapeHtml(receiptNo)}</title>
    <style>${documentFontStyles}\n${receiptDocumentStyles}</style>
</head>
<body class="receipt-doc-body">
    ${renderReceiptDocumentArticle(document, logoSrc)}
</body>
</html>`;
}

export { buildReceiptCustomerInfo, buildReceiptSummaryNote, receiptDocumentStyles };
