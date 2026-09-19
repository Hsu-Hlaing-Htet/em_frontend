import { ref, computed, onMounted } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { UTILITY_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { toQueryDate } from '@/helpers/lists/listQuery';
import { service as buildingService } from '@/modules/admin/buildings/service';
import { useUtilityStore } from '../store';

export const useUtilityApprovalList = () => {
    const buildingFilter = ref(null);
    const buildingOptions = ref([]);
    const billingMonthFrom = ref(null);
    const billingMonthTo = ref(null);
    const store = useUtilityStore();

    const loadBuildingOptions = async () => {
        const response = await buildingService.getAll({ per_page: 100 });

        buildingOptions.value = (response?.data?.data || []).map((building) => ({
            label: building.building_name,
            value: building.id,
        }));
    };

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        rejectMethod: 'reject',
        detailRouteName: 'showUtilityApproval',
        getItemLabel: (item) => item.room_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending utility approvals.',
        approveErrorMessage: 'Unable to approve utility.',
        rejectErrorMessage: 'Unable to reject utility.',
        buildRejectSuccessMessage: (item, response) => response?.message
            || `${item.room_number || `#${item.id}`} has been rejected.`,
        mapItems: (rows) => rows.map((item) => ({
            ...item,
            customer_name: item.customer_name || '',
            created_by: item.created_by_name || item.created_by || '',
        })),
        buildFilterParams: () => ({
            building_id: buildingFilter.value || undefined,
            billing_month_from: toQueryDate(billingMonthFrom.value),
            billing_month_to: toQueryDate(billingMonthTo.value),
        }),
        getWatchSources: () => [buildingFilter, billingMonthFrom, billingMonthTo],
        resetFilters: () => {
            buildingFilter.value = null;
            billingMonthFrom.value = null;
            billingMonthTo.value = null;
        },
    });

    onMounted(loadBuildingOptions);

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
            building_id: buildingFilter.value || undefined,
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
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingFilter.value)?.label || '' },
            { label: 'From Date', value: toQueryDate(billingMonthFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(billingMonthTo.value) || '' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    return {
        ...list,
        buildingFilter,
        buildingOptions,
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
