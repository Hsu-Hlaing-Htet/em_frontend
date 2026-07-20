import {
    renderAcknowledgementBlock,
    renderAmountSummaryBlock,
    renderFieldsBlock,
} from './documentSections';

export function renderReceiptDocumentLead() {
    return '';
}

export function renderReceiptDocumentBody(document) {
    if (!document) {
        return '';
    }

    return [
        renderFieldsBlock('Details', document.details),
        renderAmountSummaryBlock({
            totalLabel: document.amountReceived?.label || 'Amount Received',
            totalAmount: document.amountReceived?.amount,
        }),
        renderAcknowledgementBlock({
            message: 'Payment received and acknowledged by Rosewood Royale Residences.',
            leftName: document.acknowledgement?.customerName,
            rightName: document.acknowledgement?.representativeName,
        }),
    ].join('');
}
