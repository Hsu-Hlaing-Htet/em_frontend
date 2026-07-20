import { computed } from 'vue';
import {
    formatCurrency,
    formatPaymentReference,
    getStatusLabel,
} from '@/helpers/documents/billingDocumentHelpers';

export function usePaymentDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: formatPaymentReference(state.id),
            issuedDate: state.approved_at || state.created_at || '-',
        },
        details: [
            { label: 'Customer', value: state.customer_name },
            { label: 'Invoice Number', value: state.invoice_number || state.invoice_id },
            { label: 'Payment Date', value: state.payment_date },
            { label: 'Payment Method', value: state.payment_method_name },
            { label: 'Status', value: getStatusLabel(state.status) },
            { label: 'Building', value: state.building_name },
            { label: 'Room / Unit', value: state.room_number },
            { label: 'Note', value: state.note || '-' },
            { label: 'Submitted By', value: state.created_by_name },
            { label: 'Approved By', value: state.approved_by_name || 'Pending' },
        ],
        amountPaid: {
            label: 'Amount Paid',
            amount: formatCurrency(state.amount),
        },
        confirmationNote: 'This document confirms that the payment listed above has been recorded against the referenced invoice.',
    }));

    return { document };
}
