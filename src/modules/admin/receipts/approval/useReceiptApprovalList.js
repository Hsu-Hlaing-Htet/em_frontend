import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useReceiptStore } from '../store';

export const useReceiptApprovalList = () => useEntityApprovalList({
    store: useReceiptStore(),
    pendingStatus: 'draft',
    approveMethod: 'issue',
    rejectMethod: null,
    getItemLabel: (item) => item.receipt_number || `#${item.id}`,
    loadErrorMessage: 'Unable to load pending receipt approvals.',
    approveErrorMessage: 'Unable to issue receipt.',
    buildApproveSuccessMessage: (item, response) => response?.message
        || `${item.receipt_number || `#${item.id}`} issued and sent to customer.`,
});
