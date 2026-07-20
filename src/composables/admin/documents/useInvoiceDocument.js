import { computed } from 'vue';
import { formatCurrency, getStatusLabel } from '@/helpers/documents/billingDocumentHelpers';

export function useInvoiceDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: state.invoice_number,
            issuedDate: state.issued_date || state.created_at || '-',
        },
        details: [
            { label: 'Customer', value: state.customer_name },
            { label: 'Building', value: state.building_name },
            { label: 'Room / Unit', value: state.room_number },
            { label: 'Invoice Type', value: state.type ? state.type.charAt(0).toUpperCase() + state.type.slice(1) : '-' },
            { label: 'Due Date', value: state.due_date },
            { label: 'Late Fee', value: formatCurrency(state.late_fee) },
            { label: 'Prepared By', value: state.created_by_name },
        ],
        items: (state.items || []).map((item) => ({
            description: item.description,
            charge_type: item.charge_type_name || '-',
            amount: formatCurrency(item.amount),
        })),
        totalDue: {
            label: 'Amount Due',
            amount: formatCurrency(state.total_amount),
            details: [],
        },
        paymentTerms: 'Please settle this invoice by the due date. Late fees may apply after the due date.',
    }));

    return { document };
}
