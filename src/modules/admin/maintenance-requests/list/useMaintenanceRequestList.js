import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { MAINTENANCE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { useMaintenanceRequestStore } from '../store';

export const useMaintenanceRequestList = () => {
    const dt = ref();
    const search = ref('');
    const statusFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const maintenanceRequests = ref([]);
    const lazyParams = ref({});
    const store = useMaintenanceRequestStore();
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
        confirmDelete('Are you sure you want to delete this maintenance request?', async () => {
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

    const loadingData = async () => {
        isLoading.value = true;

        await store.fetchAll({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            status: statusFilter.value || undefined,
        });

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
        statusFilter.value = null;
        loadingData();
    };

    watch(
        [search, statusFilter],
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
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            status: statusFilter.value || undefined,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({ title: item.title, room_number: item.room_number || item.room?.room_number || '', user_name: item.user_name || item.user?.name || '', status: item.status, created_at: item.created_at }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Status', value: statusFilter.value || '' },
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
        statusFilter,
        onSort,
        onPage,
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
