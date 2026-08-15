import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useResidentStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { RESIDENT_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

export const useResidentList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const residents = ref([]);
    const lazyParams = ref({});
    const store = useResidentStore();
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

    const showLifecycleDialog = (resident) => {
        const action = resident.status === 'inactive' ? 'activate' : 'deactivate';

        confirmDelete(`Are you sure you want to ${action} ${resident.name}?`, async () => {
            await store[action]({ id: resident.id });
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
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            residents.value = data.data || [];
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
        title: 'Residents',
        filenameBase: 'residents',
        columns: RESIDENT_EXPORT_COLUMNS,
        emptyMessage: 'No residents available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({ name: item.name, email: item.email, phone: item.phone || item.profile?.phone || '', nrc: item.nrc || item.profile?.nrc || '', gender: item.gender || item.profile?.gender || '', created_at: item.created_at }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        residents,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        onSort,
        onPage,
        resetSearch,
        showLifecycleDialog,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
