import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';
import { COMPANY_INFO } from './companyInfo';
import { escapeHtml } from './htmlUtils';
import documentStyles from '@/assets/css/documents/document-styles.css?inline';

function formatMetaValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return String(value);
}

export function renderContractDocumentHeader({
    documentTitle,
    contractNo,
    issueDate,
    logoSrc,
}) {
    return `
        <header class="contract-doc-head">
            <div class="contract-doc-brand">
                ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Rosewood Royale" class="contract-doc-logo">` : ''}
                <p class="contract-doc-company">${escapeHtml(COMPANY_INFO.name)}</p>
                <p class="contract-doc-tagline">${escapeHtml(COMPANY_INFO.tagline)}</p>
            </div>
            <div class="contract-doc-meta-bar">
                <div class="contract-doc-meta-line"></div>
                <div class="contract-doc-meta-row">
                    <span class="contract-doc-meta-item">
                        <span class="contract-doc-meta-label">Contract No.</span>
                        <strong>${escapeHtml(formatMetaValue(contractNo))}</strong>
                    </span>
                    <span class="contract-doc-meta-item contract-doc-meta-item--right">
                        <span class="contract-doc-meta-label">Issue Date</span>
                        <strong>${escapeHtml(formatMetaValue(issueDate))}</strong>
                    </span>
                </div>
                <div class="contract-doc-meta-line"></div>
            </div>
            <h1 class="contract-doc-title">${escapeHtml(documentTitle)}</h1>
            <div class="contract-doc-title-rule"></div>
        </header>
    `;
}

export function renderContractFieldRows(items = []) {
    return items
        .filter((item) => hasBillingValue(item?.value))
        .map((item) => `
        <div class="contract-doc-field">
            <span class="contract-doc-field-label">${escapeHtml(item.label)}</span>
            <span class="contract-doc-field-value">${escapeHtml(formatMetaValue(item.value))}</span>
        </div>
    `).join('');
}

export function renderContractDataRows(items = []) {
    return items
        .filter((item) => hasBillingValue(item?.value))
        .map((item) => `
        <div class="contract-doc-row">
            <span class="contract-doc-row-label">${escapeHtml(item.label)}</span>
            <span class="contract-doc-row-value">${escapeHtml(formatMetaValue(item.value))}</span>
        </div>
    `).join('');
}

export function renderContractCompanyParty(companyFields = []) {
    const byLabel = Object.fromEntries(
        companyFields.map((item) => [item.label, item.value]),
    );

    const name = byLabel['Company Name'] || COMPANY_INFO.name;
    const lines = [
        byLabel.Registration,
        byLabel.Address,
        byLabel.Phone ? `Phone: ${byLabel.Phone}` : '',
        byLabel.Email ? `Email: ${byLabel.Email}` : '',
        byLabel.Website ? `Website: ${byLabel.Website}` : '',
    ].filter(Boolean);

    return `
        <p class="contract-doc-party-name">${escapeHtml(formatMetaValue(name))}</p>
        ${lines.map((line) => `<p class="contract-doc-party-line">${escapeHtml(line)}</p>`).join('')}
    `;
}

export function renderContractSection(title, contentHtml) {
    return `
        <section class="contract-doc-section">
            <h2 class="contract-doc-section-title">${escapeHtml(title)}</h2>
            ${contentHtml}
        </section>
    `;
}

export function renderContractPartiesSection({
    companyRole,
    customerRole,
    companyFields,
    customerFields,
}) {
    return renderContractSection('I. Parties to the Agreement', `
        <div class="contract-doc-parties">
            <div class="contract-doc-party">
                <p class="contract-doc-party-role">${escapeHtml(companyRole)}</p>
                ${renderContractCompanyParty(companyFields)}
            </div>
            <div class="contract-doc-party-divider" aria-hidden="true"></div>
            <div class="contract-doc-party">
                <p class="contract-doc-party-role">${escapeHtml(customerRole)}</p>
                <div class="contract-doc-fields">
                    ${renderContractFieldRows(customerFields)}
                </div>
            </div>
        </div>
    `);
}

export function renderContractDocumentFooter({ contractNo }) {
    return `
        <footer class="contract-doc-foot">
            <div class="contract-doc-foot-line"></div>
            <div class="contract-doc-foot-row">
                <span class="contract-doc-foot-brand">${escapeHtml(COMPANY_INFO.name)}</span>
                <span class="contract-doc-foot-contract">Contract No. ${escapeHtml(formatMetaValue(contractNo))}</span>
                <span class="contract-doc-foot-page" aria-label="Page number"></span>
            </div>
        </footer>
    `;
}

export function renderContractSaleFooter({ contractNo }) {
    return renderContractDocumentFooter({ contractNo });
}

export function renderContractRentFooter({ contractNo }) {
    return renderContractDocumentFooter({ contractNo });
}

export function renderContractDocumentArticle({
    documentTitle,
    contractNo,
    issueDate,
    bodyHtml,
    leadHtml = '',
    logoSrc,
    footerHtml,
}) {
    return `
        <article id="pdf-print" class="pdf-sheet contract-doc-sheet">
            ${footerHtml}
            <div class="contract-doc-lead">
                ${renderContractDocumentHeader({ documentTitle, contractNo, issueDate, logoSrc })}
                ${leadHtml}
            </div>
            <div class="contract-doc-body">
                ${bodyHtml}
            </div>
        </article>
    `;
}

export function renderContractDocumentPage({
    pageTitle,
    documentTitle,
    contractNo,
    issueDate,
    bodyHtml,
    leadHtml = '',
    logoSrc,
    footerHtml,
}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>${escapeHtml(pageTitle)}</title>
    <style>${documentStyles}</style>
</head>
<body>
    ${renderContractDocumentArticle({
        documentTitle,
        contractNo,
        issueDate,
        bodyHtml,
        leadHtml,
        logoSrc,
        footerHtml,
    })}
</body>
</html>`;
}

export { documentStyles };
