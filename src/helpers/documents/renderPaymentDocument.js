import { formatCurrency, getStatusLabel } from '@/helpers/documents/billingDocumentHelpers';
import {
    formatBillingDocumentDate,
    renderBillingDocumentBody,
} from './renderBillingDetailLayout';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

const PAYMENT_COLUMNS = [
    { label: 'Invoice No', key: 'invoice_number', align: 'left' },
    { label: 'Payment Date', key: 'payment_date', align: 'left' },
    { label: 'Payment Method', key: 'payment_method_name', align: 'left' },
    { label: 'Paid Amount', key: 'amount', align: 'right' },
    { label: 'Reference No', key: 'reference_number', align: 'left' },
    { label: 'Status', key: 'status', align: 'left' },
];

export function renderPaymentDocumentLead() {
    return '';
}

export function renderPaymentDocumentBody(document) {
    if (!document) {
        return '';
    }

    return renderBillingDocumentBody({
        customerInfo: document.customerInfo || {},
        tables: [{
            columns: PAYMENT_COLUMNS,
            rows: document.paymentRows || [],
            emptyMessage: 'No payment details recorded.',
            totalLabel: document.amountPaid?.label || 'Total',
            totalValue: document.amountPaid?.amount,
            minWidth: '40rem',
        }],
        summaryNote: document.summaryNote,
    });
}

export function buildPaymentCustomerInfo(state) {
    return {
        name: state.customer_name,
        lines: [
            state.customer_phone,
            state.customer_email,
            state.building_name,
            state.room_number,
        ].filter((value) => hasBillingValue(value)),
        issuedDate: formatBillingDocumentDate(state.approved_at || state.created_at),
    };
}

export function buildPaymentSummaryNote(state) {
    const parts = [
        hasBillingValue(state.note) ? state.note : '',
        'This document confirms that the payment listed above has been recorded against the referenced invoice.',
    ].filter((value) => hasBillingValue(value));

    return parts.join(' ');
}

export { formatBillingDocumentDate, formatCurrency, getStatusLabel };
