import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import { useListExport } from '@/composables/admin/useListExport';
import { useClickableListRow } from '@/composables/admin/useClickableListRow';
import { MAINTENANCE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { useMaintenanceRequestStore } from '../store';

export const useMaintenanceRequestList = () => {
    const dt = ref();
    const { onRowClick } = useClickableListRow('showMaintenanceRequest');
    const search = ref('');
    const priorityFilter = ref(null);
    const statusFilter = ref(null);
    const createdFrom = ref(null);
    const createdTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const maintenanceRequests = ref([]);
    const lazyParams = ref({});
    const store = useMaintenanceRequestStore();

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

    const buildFetchParams = (extra = {}) => omitEmptyParams({
        page: lazyParams.value.page + 1,
        per_page: lazyParams.value.rows,
        order: multisortConvert(lazyParams.value.multiSortMeta),
        search: search.value,
        priority: priorityFilter.value || undefined,
        status: statusFilter.value || undefined,
        created_from: toQueryDate(createdFrom.value),
        created_to: toQueryDate(createdTo.value),
        ...extra,
    });

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

    const loadingData = async () => {
        isLoading.value = true;

        await store.fetchAll(buildFetchParams());

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            maintenanceRequests.value = data.data || [];
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
    };

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        priorityFilter.value = null;
        statusFilter.value = null;
        createdFrom.value = null;
        createdTo.value = null;
        loadingData();
    };

    watch(
        [search, priorityFilter, statusFilter, createdFrom, createdTo],
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
        title: 'Maintenance Requests',
        filenameBase: 'maintenance-requests',
        columns: MAINTENANCE_EXPORT_COLUMNS,
        emptyMessage: 'No maintenance requests available to export.',
        getFetchParams: () => buildFetchParams({ page: undefined, per_page: undefined }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({
            user_name: item.user_name || item.user?.name || '',
            title: item.title,
            room_number: item.room_number || item.room?.room_number || '',
            category: item.category || '',
            priority: item.priority || '',
            status: item.status,
            created_at: item.created_at,
        }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Priority', value: priorityFilter.value || '' },
            { label: 'Status', value: statusFilter.value || '' },
            { label: 'From Date', value: toQueryDate(createdFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(createdTo.value) || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        maintenanceRequests,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        priorityFilter,
        statusFilter,
        createdFrom,
        createdTo,
        onSort,
        onPage,
        onRowClick,
        resetSearch,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
