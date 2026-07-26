import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { formatPaymentReference } from '@/helpers/documents/billingDocumentHelpers';
import { usePaymentStore } from '../store';

export const usePaymentApprovalList = () => useEntityApprovalList({
    store: usePaymentStore(),
    pendingStatus: 'pending',
    getItemLabel: (item) => item.payment_number || formatPaymentReference(item.id),
    loadErrorMessage: 'Unable to load pending payment approvals.',
    approveErrorMessage: 'Unable to approve payment.',
    rejectErrorMessage: 'Unable to reject payment.',
    buildApproveSuccessMessage: (item, response) => response?.message
        || `${item.payment_number || formatPaymentReference(item.id)} approved. A draft receipt has been created for review.`,
});
