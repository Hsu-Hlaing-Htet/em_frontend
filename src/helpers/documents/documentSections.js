import { escapeHtml, renderDataTable, renderFieldRows } from './htmlUtils';

export function renderDocumentBlock(title, innerHtml) {
    return `
        <section class="pdf-block">
            <h2 class="pdf-block-title">${escapeHtml(title)}</h2>
            <div class="pdf-rule"></div>
            ${innerHtml}
        </section>
    `;
}

export function renderFieldsBlock(title, fields = []) {
    if (!fields.length) {
        return '';
    }

    return renderDocumentBlock(title, `
        <dl class="pdf-rows pdf-rows--compact">${renderFieldRows(fields)}</dl>
    `);
}

export function renderTableBlock(title, tableConfig) {
    return renderDocumentBlock(title, renderDataTable(tableConfig));
}

export function renderAmountSummaryBlock({ totalLabel, totalAmount, details = [] }) {
    const detailRows = details.map((item) => `
        <div class="pdf-amount-summary__row">
            <span class="pdf-amount-summary__label">${escapeHtml(item.label)}</span>
            <span class="pdf-amount-summary__value">${escapeHtml(item.value ?? '—')}</span>
        </div>
    `).join('');

    return `
        <section class="pdf-block pdf-block--amount">
            <div class="pdf-amount-summary">
                ${details.length ? `<div class="pdf-amount-summary__details">${detailRows}</div>` : ''}
                <div class="pdf-amount-summary__total">
                    <span class="pdf-amount-summary__total-label">${escapeHtml(totalLabel)}</span>
                    <span class="pdf-amount-summary__total-value">${escapeHtml(totalAmount ?? '—')}</span>
                </div>
            </div>
        </section>
    `;
}

export function renderDocNote(text) {
    if (!text) {
        return '';
    }

    return `<p class="pdf-doc-note">${escapeHtml(text)}</p>`;
}

export function renderAcknowledgementBlock({
    title = 'Acknowledgement',
    message,
    leftName,
    leftRole = 'Customer Signature',
    rightName,
    rightRole = 'Company Representative',
}) {
    return `
        <section class="pdf-block pdf-block--exec">
            <h2 class="pdf-block-title">${escapeHtml(title)}</h2>
            <div class="pdf-rule"></div>
            <p class="pdf-witness">${escapeHtml(message)}</p>
            <div class="pdf-signs">
                <div class="pdf-sign">
                    <div class="pdf-sign-line"></div>
                    <p class="pdf-sign-name">${escapeHtml(leftName ?? '________________')}</p>
                    <p class="pdf-sign-role">${escapeHtml(leftRole)}</p>
                    <p class="pdf-sign-date">Date: ____________________</p>
                </div>
                <div class="pdf-sign">
                    <div class="pdf-sign-line"></div>
                    <p class="pdf-sign-name">${escapeHtml(rightName ?? '________________')}</p>
                    <p class="pdf-sign-role">${escapeHtml(rightRole)}</p>
                    <p class="pdf-sign-date">Date: ____________________</p>
                </div>
            </div>
        </section>
    `;
}
