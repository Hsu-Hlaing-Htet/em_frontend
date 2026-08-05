import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import EventBus from '@/libs/AppEventBus';
import { useLateFeeStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { LATE_FEE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

export const useLateFeeList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const lateFees = ref([]);
    const lazyParams = ref({});
    const store = useLateFeeStore();
    const errors = new Errors();
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
        confirmDelete('Are you sure you want to delete this late fee?', async () => {
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
                name: item.name,
                type: item.type,
                value: item.value,
                per: item.per,
                grace_days: item.grace_days,
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
            lateFees.value = data.data || [];
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
        title: 'Late Fees',
        filenameBase: 'late-fees',
        columns: LATE_FEE_EXPORT_COLUMNS,
        emptyMessage: 'No late fees available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({ name: item.name, type: item.type, value: item.value, per: item.per, grace_days: item.grace_days, status: item.status }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        lateFees,
        errors,
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
