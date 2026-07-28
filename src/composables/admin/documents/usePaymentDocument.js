import { computed } from 'vue';
import { formatCurrency, getStatusLabel } from '@/helpers/documents/billingDocumentHelpers';
import {
    buildPaymentCustomerInfo,
    buildPaymentSummaryNote,
} from '@/helpers/documents/renderPaymentDocument';

export function usePaymentDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: state.invoice_number || '',
            issuedDate: state.approved_at || state.created_at || '-',
        },
        customerInfo: buildPaymentCustomerInfo(state),
        paymentRows: [{
            invoice_number: state.invoice_number,
            payment_date: state.payment_date,
            payment_method_name: state.payment_method_name,
            amount: formatCurrency(state.amount),
            reference_number: state.reference_number || state.invoice_number,
            status: getStatusLabel(state.status),
        }],
        amountPaid: {
            label: 'Total',
            amount: formatCurrency(state.amount),
        },
        summaryNote: buildPaymentSummaryNote(state),
    }));

    return { document };
}
