import { ref, watch, onMounted, computed } from 'vue';
import { useDebounceFn } from '@/utils/debounce';
import EventBus from '@/libs/AppEventBus';
import { MOCK_ACTIVE_SALES } from '../../mockData';
import { filterContracts, paginateList, exportContractsToCsv, downloadCsv, formatCurrency } from '@/utils/formatter';

const EXPORT_COLUMNS = [
    { field: 'contract_no', header: 'Contract No' },
    { field: 'customer_name', header: 'Customer' },
    { field: 'building_name', header: 'Building' },
    { field: 'room_number', header: 'Room' },
    { field: 'contract_total', header: 'Contract Total' },
    { field: 'paid_amount', header: 'Paid Amount' },
    { field: 'remaining_amount', header: 'Remaining Amount' },
    { field: 'status', header: 'Status' },
];

export const useActiveSaleList = () => {
    const dt = ref();
    const search = ref('');
    const selectedStatus = ref(null);
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const contracts = ref([]);
    const lazyParams = ref({});
    const sourceData = ref([...MOCK_ACTIVE_SALES]);

    const filteredContracts = computed(() => filterContracts(sourceData.value, {
        search: search.value,
        status: selectedStatus.value,
        dateFrom: dateFrom.value,
        dateTo: dateTo.value,
    }).filter((item) => ['active', 'completed', 'cancelled'].includes(item.status)));

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

        const paginated = paginateList(filteredContracts.value, {
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

    const exportList = () => {
        const csv = exportContractsToCsv(filteredContracts.value, EXPORT_COLUMNS);

        downloadCsv('active-sales-export.csv', csv);
        EventBus.emit('show-toast', {
            severity: 'success',
            summary: '',
            detail: 'Filtered active sales list exported successfully.',
        });
    };

    const downloadList = () => {
        exportList();
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
        exportList,
        downloadList,
        formatCurrency,
    };
};
