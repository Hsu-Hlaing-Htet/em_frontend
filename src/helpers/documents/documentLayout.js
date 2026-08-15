import { COMPANY_INFO } from './companyInfo';
import { escapeHtml, renderMetaItems } from './htmlUtils';
import documentFontStyles from '@/assets/css/documents/document-font.css?inline';
import documentStyles from '@/assets/css/documents/document-styles.css?inline';

export function renderDocumentHeader({ documentTitle, meta = [], logoSrc }) {
    return `
        <header class="pdf-head">
            <div class="pdf-head-row">
                <div class="pdf-brand">
                    ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Rosewood Royale" class="pdf-logo">` : ''}
                    <div class="pdf-brand-text">
                        <p class="pdf-company">${escapeHtml(COMPANY_INFO.name)}</p>
                        <p class="pdf-company-sub">${escapeHtml(COMPANY_INFO.tagline)}</p>
                    </div>
                </div>
                <div class="pdf-head-meta">
                    ${renderMetaItems(meta)}
                </div>
            </div>
            <h1 class="pdf-doc-title">${escapeHtml(documentTitle)}</h1>
            <div class="pdf-rule pdf-rule--accent"></div>
        </header>
    `;
}

export function renderDocumentFooter() {
    return `
        <footer class="pdf-foot">
            <div class="pdf-foot-row">
                <span>Confidential</span>
                <span class="pdf-foot-page">Page 1</span>
                <span class="pdf-foot-address">${escapeHtml(COMPANY_INFO.address)}</span>
            </div>
        </footer>
    `;
}

export function renderDocumentArticle({
    documentTitle,
    meta = [],
    bodyHtml,
    leadHtml = '',
    logoSrc,
}) {
    return `
        <article id="pdf-print" class="pdf-sheet">
            <div class="pdf-document-lead">
                ${renderDocumentHeader({ documentTitle, meta, logoSrc })}
                ${leadHtml}
            </div>
            ${bodyHtml}
            ${renderDocumentFooter()}
        </article>
    `;
}

export function renderDocumentPage({
    pageTitle,
    documentTitle,
    meta = [],
    bodyHtml,
    leadHtml = '',
    logoSrc,
}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>${escapeHtml(pageTitle)}</title>
    <style>${documentFontStyles}\n${documentStyles}</style>
</head>
<body>
    ${renderDocumentArticle({ documentTitle, meta, bodyHtml, leadHtml, logoSrc })}
</body>
</html>`;
}

export { documentStyles };
