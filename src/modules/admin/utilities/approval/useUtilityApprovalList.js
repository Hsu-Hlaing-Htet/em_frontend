import { ref, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { UTILITY_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { useUtilityStore } from '../store';

export const useUtilityApprovalList = () => {
    const statusFilter = ref('pending');
    const store = useUtilityStore();

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        getItemLabel: (item) => item.room_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending utility approvals.',
        approveErrorMessage: 'Unable to approve utility.',
        rejectErrorMessage: 'Unable to reject utility.',
        mapItems: (rows) => rows.map((item) => ({
            ...item,
            customer_name: item.customer_name || '',
            created_by: item.created_by_name || item.created_by || '',
        })),
        getWatchSources: () => [statusFilter],
        resetFilters: () => {
            statusFilter.value = 'pending';
        },
    });

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Utility Approvals',
        filenameBase: 'utility-approvals',
        columns: UTILITY_EXPORT_COLUMNS,
        emptyMessage: 'No utility approvals available to export.',
        getFetchParams: () => ({
            order: multisortConvert(list.lazyParams.value.multiSortMeta) || undefined,
            search: list.search.value?.trim() || undefined,
            status: 'pending',
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);

            return store.getAllResponse;
        },
        mapItem: (item) => ({
            customer_name: item.customer_name || '',
            room_number: item.room_number || item.room?.room_number || '',
            total_amount: item.total_amount,
            status: item.status,
            created_by_name: item.created_by_name || item.created_by || '',
            created_at: item.created_at,
        }),
        getFilterSummary: () => [
            { label: 'Search', value: list.search.value || '' },
            { label: 'Status', value: 'pending' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    return {
        ...list,
        statusFilter,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
