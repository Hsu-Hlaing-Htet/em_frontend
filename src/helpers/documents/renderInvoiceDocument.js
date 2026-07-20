import {
    renderAmountSummaryBlock,
    renderDocNote,
    renderFieldsBlock,
    renderTableBlock,
} from './documentSections';

export function renderInvoiceDocumentLead() {
    return '';
}

export function renderInvoiceDocumentBody(document) {
    if (!document) {
        return '';
    }

    return [
        renderFieldsBlock('Details', document.details),
        renderTableBlock('Line Items', {
            columns: [
                { label: 'Description', key: 'description' },
                { label: 'Charge Type', key: 'charge_type' },
                { label: 'Amount', key: 'amount' },
            ],
            rows: document.items || [],
            emptyMessage: 'No line items recorded.',
        }),
        renderAmountSummaryBlock({
            totalLabel: document.totalDue?.label || 'Amount Due',
            totalAmount: document.totalDue?.amount,
            details: document.totalDue?.details || [],
        }),
        renderDocNote(document.paymentTerms),
    ].join('');
}
