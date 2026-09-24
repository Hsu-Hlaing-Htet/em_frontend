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

function isCompanySignature(signature = {}) {
    const role = String(signature.role || '');
    const label = String(signature.label || '');

    return /authorized officer|company representative|company|seller|landlord/i.test(`${role} ${label}`);
}

function groupSignatures(signatures = []) {
    const groups = [];

    signatures.forEach((signature) => {
        const company = isCompanySignature(signature);
        const roleKey = company
            ? 'company'
            : String(signature.role || signature.label || 'Signature');
        const last = groups[groups.length - 1];

        if (last && last.roleKey === roleKey && !company) {
            last.parties.push(signature);
            return;
        }

        groups.push({
            roleKey,
            company,
            heading: company
                ? (signature.label || 'Company Representative')
                : (signature.role || signature.label || 'Signature'),
            parties: [signature],
        });
    });

    return groups;
}

function renderSignatureBlocks(signatures = []) {
    const items = signatures.length ? signatures : [
        { role: 'Customer', label: 'Customer', name: '' },
        { role: 'Authorized Officer', label: 'Company Representative', name: '' },
    ];
    const groups = groupSignatures(items);
    const hasJoint = groups.some((group) => group.parties.length > 1);

    return `
        <div class="contract-doc-signatures${hasJoint ? ' contract-doc-signatures--joint' : ''}">
            ${groups.map((group) => `
                <div class="contract-doc-signature-block${group.parties.length > 1 ? ' contract-doc-signature-block--multi' : ''}">
                    <p class="contract-doc-signature-role">${escapeHtml(group.heading)}</p>
                    <div class="contract-doc-signature-parties">
                        ${group.parties.map((party) => `
                            <div class="contract-doc-signature-party">
                                <p class="contract-doc-signature-blank-line">________________</p>
                                <p class="contract-doc-signature-name">${escapeHtml(party?.name || '________________')}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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
            secondCustomerFields: (document.secondCustomer || []).filter((item) => item.label !== 'Address'),
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
            ${renderSignatureBlocks(document.signatures)}
            <p class="contract-doc-signature-note">Signatures are completed manually on the printed copy.</p>
        `)}
    `;
}

export function getContractDocumentMeta(document) {
    return [
        { label: 'Contract No.', value: document?.header?.contractNo || '—' },
        { label: 'Issue Date', value: document?.header?.issuedDate || '—' },
    ];
}
