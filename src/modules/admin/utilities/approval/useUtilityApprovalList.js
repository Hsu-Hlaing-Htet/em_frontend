import { ref, computed, onMounted } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { UTILITY_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { toQueryDate } from '@/helpers/lists/listQuery';
import { service as roomService } from '@/modules/admin/rooms/service';
import { useUtilityStore } from '../store';

export const useUtilityApprovalList = () => {
    const statusFilter = ref(null);
    const roomFilter = ref(null);
    const roomOptions = ref([]);
    const billingMonthFrom = ref(null);
    const billingMonthTo = ref(null);
    const store = useUtilityStore();

    const loadRoomOptions = async () => {
        const response = await roomService.getAll({ per_page: 500 });

        roomOptions.value = (response?.data?.data || []).map((room) => ({
            label: room.building_name
                ? `${room.building_name} - ${room.room_number}`
                : room.room_number,
            value: room.id,
        }));
    };

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
        buildFilterParams: () => ({
            room_id: roomFilter.value || undefined,
            billing_month_from: toQueryDate(billingMonthFrom.value),
            billing_month_to: toQueryDate(billingMonthTo.value),
        }),
        getWatchSources: () => [statusFilter, roomFilter, billingMonthFrom, billingMonthTo],
        resetFilters: () => {
            statusFilter.value = null;
            roomFilter.value = null;
            billingMonthFrom.value = null;
            billingMonthTo.value = null;
        },
    });

    onMounted(loadRoomOptions);

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
            room_id: roomFilter.value || undefined,
            billing_month_from: toQueryDate(billingMonthFrom.value),
            billing_month_to: toQueryDate(billingMonthTo.value),
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
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomFilter.value)?.label || '' },
            { label: 'Billing Month From', value: toQueryDate(billingMonthFrom.value) || '' },
            { label: 'Billing Month To', value: toQueryDate(billingMonthTo.value) || '' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    return {
        ...list,
        statusFilter,
        roomFilter,
        roomOptions,
        billingMonthFrom,
        billingMonthTo,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
