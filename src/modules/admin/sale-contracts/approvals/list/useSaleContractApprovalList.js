import { ref, watch, onMounted } from 'vue';
import { useDebounceFn } from '@/utils/debounce';
import { MOCK_PENDING_APPROVALS } from '../../mockData';
import { filterContracts, paginateList, formatCurrency } from '@/utils/formatter';

export const useSaleContractApprovalList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const contracts = ref([]);
    const lazyParams = ref({});
    const sourceData = ref([...MOCK_PENDING_APPROVALS]);

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
            status: 'pending_approval',
            dateField: 'submitted_at',
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
        loadingData();
    };

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    watch(
        [search],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 300),
    );

    return {
        dt,
        search,
        contracts,
        totalRecords,
        lazyParams,
        isLoading,
        onPage,
        onSort,
        resetSearch,
        formatCurrency,
    };
};
