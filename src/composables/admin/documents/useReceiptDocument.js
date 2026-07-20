import { computed } from 'vue';
import { formatCurrency, getStatusLabel } from '@/helpers/documents/billingDocumentHelpers';

export function useReceiptDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: state.receipt_number,
            issuedDate: state.issued_at || state.created_at || '-',
        },
        details: [
            { label: 'Customer', value: state.customer_name },
            { label: 'Receipt Number', value: state.receipt_number },
            { label: 'Invoice Number', value: state.invoice_number },
            { label: 'Payment Date', value: state.payment_date },
            { label: 'Payment Method', value: state.payment_method_name },
            { label: 'Status', value: getStatusLabel(state.status) },
            { label: 'Building', value: state.building_name },
            { label: 'Room / Unit', value: state.room_number },
        ],
        amountReceived: {
            label: 'Amount Received',
            amount: formatCurrency(state.payment_amount),
        },
        acknowledgement: {
            customerName: state.customer_name,
            representativeName: state.approved_by_name || 'Pending',
        },
    }));

    return { document };
}
