import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { useClickableListRow } from '@/composables/admin/useClickableListRow';
import { UTILITY_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { toQueryDate } from '@/helpers/lists/listQuery';
import { service as buildingService } from '@/modules/admin/buildings/service';
import { useUtilityStore } from '../store';

export const useUtilityList = () => {
    const dt = ref();
    const { onRowClick } = useClickableListRow('showUtility');
    const search = ref('');
    const statusFilter = ref(null);
    const buildingFilter = ref(null);
    const buildingOptions = ref([]);
    const billingMonthFrom = ref(null);
    const billingMonthTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const utilities = ref([]);
    const lazyParams = ref({});
    const store = useUtilityStore();
    const { confirmDelete } = useDeleteConfirm();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            multiSortMeta: [],
            first: 0,
        };
    };

    const showConfirmDialog = (id) => {
        confirmDelete('Are you sure you want to delete this utility record?', async () => {
            await store.delete({ id });
            await loadingData();
        });
    };

    const onPage = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = event.page;
        loadingData();
    };

    const onSort = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = 0;
        lazyParams.value.first = 0;
        loadingData();
    };

    const buildFetchParams = () => ({
        page: lazyParams.value.page + 1,
        per_page: lazyParams.value.rows,
        order: multisortConvert(lazyParams.value.multiSortMeta),
        search: search.value?.trim() || undefined,
        status: statusFilter.value || undefined,
        building_id: buildingFilter.value || undefined,
        billing_month_from: toQueryDate(billingMonthFrom.value),
        billing_month_to: toQueryDate(billingMonthTo.value),
    });

    const loadingData = async () => {
        isLoading.value = true;

        await store.fetchAll(buildFetchParams());

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            utilities.value = data.data || [];
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
    };

    const loadBuildingOptions = async () => {
        const response = await buildingService.getAll({ per_page: 100 });

        buildingOptions.value = (response?.data?.data || []).map((building) => ({
            label: building.building_name,
            value: building.id,
        }));
    };

    onMounted(() => {
        resetPagination();
        loadBuildingOptions();
        loadingData();
    });

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        statusFilter.value = null;
        buildingFilter.value = null;
        billingMonthFrom.value = null;
        billingMonthTo.value = null;
        loadingData();
    };

    watch(
        [search, statusFilter, buildingFilter, billingMonthFrom, billingMonthTo],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 500),
    );

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Utilities',
        filenameBase: 'utilities',
        columns: UTILITY_EXPORT_COLUMNS,
        emptyMessage: 'No utilities available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value?.trim() || undefined,
            status: statusFilter.value || undefined,
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
            { label: 'Search', value: search.value || '' },
            { label: 'Status', value: statusFilter.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingFilter.value)?.label || '' },
            { label: 'Billing Month From', value: toQueryDate(billingMonthFrom.value) || '' },
            { label: 'Billing Month To', value: toQueryDate(billingMonthTo.value) || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        utilities,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        statusFilter,
        buildingFilter,
        buildingOptions,
        billingMonthFrom,
        billingMonthTo,
        onSort,
        onPage,
        onRowClick,
        resetSearch,
        showConfirmDialog,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
