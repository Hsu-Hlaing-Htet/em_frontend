import { escapeHtml } from './htmlUtils';
import {
    renderContractDataRows,
    renderContractSection,
    renderContractPartiesSection,
} from './renderContractDocumentLayout';
import {
    buildDocumentAuthorizationRows,
    buildFinancialRows,
    buildPropertyLocationRows,
} from './contractDocumentRows';

function renderSignatureLines(signatures = []) {
    const customer = signatures[0];
    const company = signatures[1];

    const lines = [
        { label: customer?.label || 'Customer Signature', key: 'customer' },
        { label: company?.label || 'Company Representative', key: 'company' },
    ];

    return lines.map((line) => `
        <p class="contract-doc-signature-line">
            <span class="contract-doc-signature-label">${escapeHtml(line.label)}:</span>
            <span class="contract-doc-signature-blank">________</span>
        </p>
    `).join('');
}

function renderCovenantItems(items = []) {
    return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

export function renderContractDocumentBody(document, variant) {
    if (!document) {
        return '';
    }

    const propertyLocationRows = buildPropertyLocationRows(document);
    const financialRows = buildFinancialRows(document, variant);
    const authorizationRows = buildDocumentAuthorizationRows(document);

    const covenantItems = [
        variant.customerObligation,
        variant.companyObligation,
        document.remarks ? `Remarks: ${document.remarks}` : '',
    ].filter(Boolean);

    const authorizationSection = authorizationRows.length
        ? renderContractSection('V. Document Authorization', `
            <div class="contract-doc-rows">
                ${renderContractDataRows(authorizationRows)}
            </div>
        `)
        : '';

    return `
        ${renderContractPartiesSection({
            companyRole: variant.companyRole,
            customerRole: variant.customerRole,
            companyFields: document.company,
            customerFields: (document.customer || []).filter((item) => item.label !== 'Address'),
        })}

        ${renderContractSection('II. Property', `
            <div class="contract-doc-rows contract-doc-rows--property">
                ${renderContractDataRows(
                    propertyLocationRows.length ? propertyLocationRows : document.property,
                )}
            </div>
        `)}

        ${renderContractSection('III. Term and Financial Conditions', `
            <div class="contract-doc-rows">
                ${renderContractDataRows(financialRows)}
            </div>
        `)}

        ${renderContractSection('IV. General Covenants', `
            <ol class="contract-doc-covenants">
                ${renderCovenantItems(covenantItems)}
            </ol>
        `)}

        ${authorizationSection}

        ${renderContractSection('VI. Execution', `
            <p class="contract-doc-witness">
                IN WITNESS WHEREOF, the parties hereto have executed this ${escapeHtml(variant.agreementName)}
                as of the date first written above.
            </p>
            <div class="contract-doc-signatures">
                ${renderSignatureLines(document.signatures)}
            </div>
        `)}
    `;
}

export function getContractDocumentMeta(document) {
    return [
        { label: 'Contract No.', value: document?.header?.contractNo || '—' },
        { label: 'Issue Date', value: document?.header?.issuedDate || '—' },
    ];
}
