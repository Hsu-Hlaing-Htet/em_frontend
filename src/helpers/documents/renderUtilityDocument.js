import {
    renderAmountSummaryBlock,
    renderFieldsBlock,
    renderTableBlock,
} from './documentSections';

export function renderUtilityDocumentLead() {
    return '';
}

export function renderUtilityDocumentBody(document) {
    if (!document) {
        return '';
    }

    return [
        renderFieldsBlock('Details', document.details),
        renderTableBlock('Meter Readings', {
            columns: [
                { label: 'Utility Type', key: 'utility_type' },
                { label: 'Previous', key: 'previous_reading' },
                { label: 'Current', key: 'current_reading' },
                { label: 'Usage', key: 'usage' },
                { label: 'Unit Price', key: 'unit_price' },
                { label: 'Amount', key: 'amount' },
            ],
            rows: document.readings || [],
            emptyMessage: 'No meter readings recorded.',
        }),
        renderAmountSummaryBlock({
            totalLabel: document.totalDue?.label || 'Total Amount',
            totalAmount: document.totalDue?.amount,
        }),
    ].join('');
}
