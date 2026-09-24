import { formatCurrency } from './billingDocumentHelpers';
import { formatBillingDocumentDate } from './renderBillingDetailLayout';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

/**
 * Detail-page helpers only. Invoice Preview / Print / PDF / Email HTML is rendered
 * server-side by InvoiceDocumentService (canonical Blade + CSS).
 */
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
