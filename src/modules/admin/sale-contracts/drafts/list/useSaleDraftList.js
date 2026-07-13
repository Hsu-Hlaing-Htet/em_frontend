import { ref, watch, onMounted } from 'vue';
import { useDebounceFn } from '@/utils/debounce';
import { useDeleteConfirm } from '@/utils/confirmDelete';
import EventBus from '@/libs/AppEventBus';
import { MOCK_DRAFT_CONTRACTS } from '../../mockData';
import { filterContracts, paginateList, formatCurrency } from '@/utils/formatter';
export const useSaleDraftList = () => {
    const dt = ref();
    const search = ref('');
    const selectedStatus = ref(null);
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const contracts = ref([]);
    const lazyParams = ref({});
    const sourceData = ref([...MOCK_DRAFT_CONTRACTS]);
    const { confirmDelete } = useDeleteConfirm();

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            multiSortMeta: [],
            first: 0,
        };
    };

    const loadingData = async () => {
        isLoading.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        const filtered = filterContracts(sourceData.value, {
            search: search.value,
            status: selectedStatus.value,
            dateFrom: dateFrom.value,
            dateTo: dateTo.value,
        });

        const paginated = paginateList(filtered, {
            page: lazyParams.value.page || 0,
            rows: lazyParams.value.rows || 10,
        });

        contracts.value = paginated.data;
        totalRecords.value = paginated.total;
        lazyParams.value.first = paginated.first;

        isLoading.value = false;
    };

    const onPage = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = event.page;
        loadingData();
    };

    const onSort = () => {
        loadingData();
    };

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        selectedStatus.value = null;
        dateFrom.value = null;
        dateTo.value = null;
        loadingData();
    };

    const showConfirmDialog = (id, contractNo) => {
        confirmDelete(`Are you sure you want to delete ${contractNo}?`, async () => {
            sourceData.value = sourceData.value.filter((item) => item.id !== id);
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Sale contract draft deleted successfully.',
            });
            await loadingData();
        });
    };

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    watch(
        [search, selectedStatus, dateFrom, dateTo],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 300),
    );

    return {
        dt,
        search,
        selectedStatus,
        dateFrom,
        dateTo,
        contracts,
        totalRecords,
        lazyParams,
        isLoading,
        onPage,
        onSort,
        resetSearch,
        showConfirmDialog,
        formatCurrency,
    };
};
