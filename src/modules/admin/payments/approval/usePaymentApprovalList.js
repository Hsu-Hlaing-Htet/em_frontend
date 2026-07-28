import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { usePaymentStore } from '../store';

export const usePaymentApprovalList = () => useEntityApprovalList({
    store: usePaymentStore(),
    pendingStatus: 'pending',
    getItemLabel: (item) => item.invoice_number || `#${item.id}`,
    loadErrorMessage: 'Unable to load pending payment approvals.',
    approveErrorMessage: 'Unable to approve payment.',
    rejectErrorMessage: 'Unable to reject payment.',
    buildApproveSuccessMessage: (item, response) => response?.message
        || `${item.invoice_number || `#${item.id}`} approved. A draft receipt has been created for review.`,
});
