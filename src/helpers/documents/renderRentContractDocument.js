import {
    getContractDocumentMeta,
    renderContractDocumentBody,
} from './renderContractDocumentShared';

export { getContractDocumentMeta as getRentContractDocumentMeta } from './renderContractDocumentShared';

const RENT_VARIANT = {
    kind: 'rent',
    companyRole: 'Landlord',
    customerRole: 'Tenant',
    agreementName: 'Rental/Lease Agreement',
    customerObligation: 'The Tenant shall pay all amounts due under this Agreement in accordance with the agreed payment schedule, maintain the property in good condition, and comply with all applicable building rules and regulations.',
    companyObligation: 'The Landlord shall provide the property in habitable condition, maintain common areas, and ensure the premises remain available for the Tenant for the lease term.',
};

export function renderRentContractDocumentLead() {
    return `
        <p class="contract-doc-preamble">
            This Rental/Lease Agreement ("Agreement") is made between the Landlord and the
            Tenant identified below, concerning the residential unit described herein, upon
            the terms and conditions set forth in this document.
        </p>
    `;
}

export function renderRentContractDocumentBodyForRent(document) {
    return renderContractDocumentBody(document, RENT_VARIANT);
}

export { renderRentContractDocumentBodyForRent as renderRentContractDocumentBody };
