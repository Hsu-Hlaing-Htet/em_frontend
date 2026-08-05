import {
    getContractDocumentMeta,
    renderContractDocumentBody,
} from './renderContractDocumentShared';

export { getContractDocumentMeta } from './renderContractDocumentShared';

const SALE_VARIANT = {
    kind: 'sale',
    companyRole: 'Seller',
    customerRole: 'Purchaser',
    agreementName: 'Property Sale Agreement',
    customerObligation: 'The Purchaser shall pay all amounts due under this Agreement in accordance with the agreed payment schedule, maintain the property in good condition, and comply with all applicable building rules and regulations.',
    companyObligation: 'The Seller shall deliver clear title to the property, provide all necessary documentation, and ensure the property is transferred in the condition agreed upon at the time of execution.',
};

export function renderContractDocumentLead() {
    return `
        <p class="contract-doc-preamble">
            This Property Sale Agreement ("Agreement") is made between the Seller and the
            Purchaser identified below, concerning the residential unit described herein, upon
            the terms and conditions set forth in this document.
        </p>
    `;
}

export function renderContractDocumentBodyForSale(document) {
    return renderContractDocumentBody(document, SALE_VARIANT);
}

// Backward-compatible export used by documentOutput and ContractPdfSheet
export { renderContractDocumentBodyForSale as renderContractDocumentBody };
