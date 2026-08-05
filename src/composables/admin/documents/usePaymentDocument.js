import { computed } from 'vue';
import {
    formatCurrency,
    formatPaymentReference,
} from '@/helpers/documents/billingDocumentHelpers';
import {
    buildDocumentAuthorization,
    buildPaymentDocumentNote,
    buildPaymentReferenceValue,
} from '@/helpers/documents/billingDocumentContent';
import { buildPaymentCustomerInfo } from '@/helpers/documents/renderPaymentDocument';

export function usePaymentDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: formatPaymentReference(state.reference_number || state.id),
            issuedDate: state.approved_at || state.created_at || '',
        },
        customerInfo: buildPaymentCustomerInfo(state),
        paymentRows: [{
            invoice_number: state.invoice_number,
            payment_date: state.payment_date,
            payment_method_name: state.payment_method_name,
            reference_number: buildPaymentReferenceValue(state),
            amount: formatCurrency(state.amount),
        }],
        amountPaid: {
            label: 'Amount Paid',
            amount: formatCurrency(state.amount),
        },
        summaryNote: buildPaymentDocumentNote(state),
        authorization: buildDocumentAuthorization({
            preparedBy: state.created_by_name,
            preparedAt: state.created_at,
            approvedBy: state.approved_by_name,
            approvedAt: state.approved_at,
        }),
    }));

    return { document };
}
