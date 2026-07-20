export function getBillingDocumentMeta(document, referenceLabel) {
    return [
        { label: referenceLabel, value: document?.header?.referenceNo || '—' },
        { label: 'Issue Date', value: document?.header?.issuedDate || '—' },
    ];
}
