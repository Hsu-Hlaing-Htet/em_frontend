import { computed } from 'vue';
import { formatCurrency } from '@/helpers/documents/billingDocumentHelpers';
import {
    buildInvoiceCustomerInfo,
    buildInvoiceSummaryNote,
} from '@/helpers/documents/renderInvoiceDocument';

export function useInvoiceDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: state.invoice_number,
            issuedDate: state.issued_date || state.created_at || '-',
        },
        customerInfo: buildInvoiceCustomerInfo(state),
        items: (state.items || []).map((item) => ({
            description: item.description,
            charge_type: item.charge_type_name || '',
            amount: formatCurrency(item.amount),
        })),
        totalDue: {
            label: 'Total',
            amount: formatCurrency(state.total_amount),
        },
        summaryNote: buildInvoiceSummaryNote(state),
    }));

    return { document };
}
