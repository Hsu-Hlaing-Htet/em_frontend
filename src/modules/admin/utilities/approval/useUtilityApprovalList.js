import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useUtilityStore } from '../store';

export const useUtilityApprovalList = () => useEntityApprovalList({
    store: useUtilityStore(),
    pendingStatus: 'pending',
    getItemLabel: (item) => item.room_number || `#${item.id}`,
    loadErrorMessage: 'Unable to load pending utility approvals.',
    approveErrorMessage: 'Unable to approve utility.',
    rejectErrorMessage: 'Unable to reject utility.',
});
