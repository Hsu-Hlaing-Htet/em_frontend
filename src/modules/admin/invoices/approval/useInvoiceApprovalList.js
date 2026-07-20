import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useInvoiceStore } from '../store';

export const useInvoiceApprovalList = () => useEntityApprovalList({
    store: useInvoiceStore(),
    pendingStatus: 'draft',
    approveMethod: 'issue',
    rejectMethod: null,
    getItemLabel: (item) => item.invoice_number || `#${item.id}`,
    loadErrorMessage: 'Unable to load pending invoice approvals.',
    approveErrorMessage: 'Unable to approve invoice.',
    buildApproveSuccessMessage: (item, response) => response?.message
        || `${item.invoice_number || `#${item.id}`} issued and sent to customer.`,
});
