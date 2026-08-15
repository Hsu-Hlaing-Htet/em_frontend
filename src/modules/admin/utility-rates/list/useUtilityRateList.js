import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import EventBus from '@/libs/AppEventBus';
import { useUtilityRateStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { UTILITY_RATE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

export const useUtilityRateList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const utilityRates = ref([]);
    const lazyParams = ref({});
    const store = useUtilityRateStore();
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
        confirmDelete('Are you sure you want to delete this utility rate?', async () => {
            await store.delete({ id });
            await loadingData();
        });
    };

    const toggleStatus = async (item, active) => {
        const previousStatus = item.status;
        const newStatus = active ? 'active' : 'inactive';

        if (previousStatus === newStatus) {
            return;
        }

        item.status = newStatus;

        try {
            await store.update({
                id: item.id,
                utility_type_id: item.utility_type_id,
                unit_price: item.unit_price,
                effective_date: item.effective_date,
                status: newStatus,
            });
            const response = store.getUpdateResponse;

            if (response) {
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch {
            item.status = previousStatus;
        }
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
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            utilityRates.value = data.data || [];
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
        loadingData();
    };

    watch(
        [search],
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
        title: 'Utility Rates',
        filenameBase: 'utility-rates',
        columns: UTILITY_RATE_EXPORT_COLUMNS,
        emptyMessage: 'No utility rates available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({ type_name: item.type_name || item.utility_type?.name || '', unit_price: item.unit_price, effective_date: item.effective_date, status: item.status, created_at: item.created_at }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        utilityRates,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
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
toggleStatus,
    };
};
