import { formatCurrency } from '@/helpers/documents/billingDocumentHelpers';
import {
    formatBillingDocumentDate,
    renderBillingDocumentBody,
} from './renderBillingDetailLayout';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

const LINE_ITEM_COLUMNS = [
    { label: 'Description', key: 'description', align: 'left' },
    { label: 'Charge Type', key: 'charge_type', align: 'left' },
    { label: 'Amount', key: 'amount', align: 'right' },
];

export function renderInvoiceDocumentLead() {
    return '';
}

export function renderInvoiceDocumentBody(document) {
    if (!document) {
        return '';
    }

    return renderBillingDocumentBody({
        customerInfo: document.customerInfo || {},
        tables: [{
            columns: LINE_ITEM_COLUMNS,
            rows: document.items || [],
            emptyMessage: 'No line items recorded.',
            totalLabel: document.totalDue?.label || 'Total',
            totalValue: document.totalDue?.amount,
            minWidth: '32rem',
        }],
        summaryNote: document.summaryNote,
    });
}

export function buildInvoiceCustomerInfo(state) {
    return {
        name: state.customer_name,
        lines: [
        state.customer_email,
        state.customer_phone,
        state.customer_address,
        state.building_name,
            state.room_number,
        ].filter((value) => hasBillingValue(value)),
        issuedDate: formatBillingDocumentDate(state.issued_date || state.created_at),
    };
}

export function buildInvoiceSummaryNote(state) {
    const parts = [];

    if (hasBillingValue(state.notes)) {
        parts.push(state.notes);
    }

    parts.push('Please settle this invoice by the due date. Late fees may apply after the due date.');

    return parts.join(' ');
}

export { formatBillingDocumentDate, formatCurrency };
