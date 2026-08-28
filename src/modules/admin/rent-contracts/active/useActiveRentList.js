import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { formatCurrency, getPaymentTypeLabel } from '@/utils/formatter';
import { filterContracts, normalizePaymentTypeFilter } from '@/helpers/contracts/contractFilters';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentStore } from '../store';
import { mapRentListItemFromApi } from '../mapRent';
import { useContractListExport } from '@/composables/admin/contracts/useContractListExport';
import { RENT_EXPORT_COLUMNS_BY_LIST } from '@/helpers/contracts/exportColumns';

export const useActiveRentList = () => {
    const dt = ref();
    const search = ref('');
    const selectedPaymentType = ref(null);
    const selectedStatus = ref(null);
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const contracts = ref([]);
    const lazyParams = ref({
        page: 0,
        rows: 10,
        multiSortMeta: [],
        first: 0,
    });
    const store = useRentStore();

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

        try {
            const paymentType = normalizePaymentTypeFilter(selectedPaymentType.value);

            await store.fetchActive({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta),
                search: search.value,
                payment_type: paymentType,
                status: selectedStatus.value || undefined,
            });

            const response = store.getAllResponse;

            if (response?.data) {
                let items = (response.data.data || [])
                    .map(mapRentListItemFromApi)
                    .filter(Boolean);

                items = filterContracts(items, {
                    search: '',
                    dateFrom: dateFrom.value,
                    dateTo: dateTo.value,
                });

                contracts.value = items;
                totalRecords.value = response.data.total;
            } else {
                contracts.value = [];
                totalRecords.value = 0;
            }
        } catch (error) {
            contracts.value = [];
            totalRecords.value = 0;
            showApiErrorToast(error, 'Unable to load active rents.');
        } finally {
            isLoading.value = false;
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

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        selectedPaymentType.value = null;
        selectedStatus.value = null;
        dateFrom.value = null;
        dateTo.value = null;
        loadingData();
    };

    const applyExportFilters = (items) => filterContracts(items, {
        search: '',
        dateFrom: dateFrom.value,
        dateTo: dateTo.value,
    });

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useContractListExport({
        exportColumnsByList: RENT_EXPORT_COLUMNS_BY_LIST,
        listType: 'active',
        title: 'Active Rents',
        filenameBase: 'active-rents',
        emptyMessage: 'No active rents available to export.',
        getVisibleRows: () => contracts.value,
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            payment_type: normalizePaymentTypeFilter(selectedPaymentType.value),
            status: selectedStatus.value || undefined,
        }),
        fetchPage: async (params) => {
            await store.fetchActive(params);

            return store.getAllResponse;
        },
        mapItem: mapRentListItemFromApi,
        applyFilters: applyExportFilters,
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Plan', value: (typeof getPaymentTypeLabel === 'function' ? getPaymentTypeLabel(selectedPaymentType.value) : selectedPaymentType.value) || '' },
            { label: 'Status', value: selectedStatus.value || '' },
            { label: 'From Date', value: dateFrom.value ? String(dateFrom.value).slice(0, 10) : '' },
            { label: 'To Date', value: dateTo.value ? String(dateTo.value).slice(0, 10) : '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    watch(
        [search, selectedPaymentType, selectedStatus, dateFrom, dateTo],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 300),
    );

    return {
        dt,
        search,
        selectedPaymentType,
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
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
        formatCurrency,
        getPaymentTypeLabel,
    };
};
