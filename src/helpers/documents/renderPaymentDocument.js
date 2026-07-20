import {
    renderAmountSummaryBlock,
    renderDocNote,
    renderFieldsBlock,
} from './documentSections';

export function renderPaymentDocumentLead() {
    return '';
}

export function renderPaymentDocumentBody(document) {
    if (!document) {
        return '';
    }

    return [
        renderFieldsBlock('Details', document.details),
        renderAmountSummaryBlock({
            totalLabel: document.amountPaid?.label || 'Amount Paid',
            totalAmount: document.amountPaid?.amount,
        }),
        renderDocNote(document.confirmationNote),
    ].join('');
}
