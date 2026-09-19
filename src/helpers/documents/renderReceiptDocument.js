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

    const lateFeeRow = document.late_fee
        ? `
            <tr>
                <td>${cell(document.late_fee.description || 'Late Fee')}</td>
                <td class="is-num">${cell(document.late_fee.amount)}</td>
            </tr>
        `
        : '';

    return `
        <section class="receipt-doc__info">
            <div class="receipt-doc__info-col">
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Customer Name</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.customer_name)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Property / Room</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.property_room)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Invoice No.</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.invoice_number)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Payment For</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.payment_for)}</span>
                </div>
            </div>
            <div class="receipt-doc__info-col">
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Receipt No.</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.receipt_number)}</span>
                </div>
                <div class="receipt-doc__info-row">
                    <span class="receipt-doc__info-label">Receipt Date</span>
                    <span class="receipt-doc__info-value">${cell(document.info?.receipt_date)}</span>
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
                    ${lateFeeRow}
                </tbody>
            </table>
        </div>

        <div class="receipt-doc__totals">
            <div class="receipt-doc__totals-row">
                <span>Amount Due</span>
                <span>${cell(document.totals?.amount_due || document.totals?.total_amount)}</span>
            </div>
            <div class="receipt-doc__totals-row">
                <span>Amount Received</span>
                <span>${cell(document.totals?.amount_received)}</span>
            </div>
            ${document.totals?.show_change ? `
            <div class="receipt-doc__totals-row">
                <span>Change</span>
                <span>${cell(document.totals?.refund_amount)}</span>
            </div>
            ` : ''}
            <div class="receipt-doc__totals-row receipt-doc__totals-row--due">
                <span>Remaining Balance</span>
                <span>${cell(document.totals?.remaining_balance)}</span>
            </div>
        </div>

        <section class="receipt-doc__confirmation">
            <p class="receipt-doc__confirmation-title">${cell(document.confirmation?.title || 'Payment received successfully.')}</p>
            <p class="receipt-doc__confirmation-message">${cell(document.confirmation?.message || 'This receipt confirms that the payment has been recorded successfully.')}</p>
        </section>
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
                <span>${escapeHtml(document.footer?.left || company.name || COMPANY_INFO.name)}</span>
                <span>${escapeHtml(document.footer?.right || 'System-generated receipt • No signature required')}</span>
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
