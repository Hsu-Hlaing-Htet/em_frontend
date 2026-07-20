import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { formatCurrency, getPaymentTypeLabel } from '@/utils/formatter';
import { filterContracts, normalizePaymentTypeFilter } from '@/helpers/contracts/contractFilters';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleStore } from '../store';
import { mapSaleListItemFromApi } from '../mapSale';
import { useContractListExport } from '@/composables/admin/contracts/useContractListExport';
import { SALE_EXPORT_COLUMNS_BY_LIST } from '@/helpers/contracts/exportColumns';

export const useActiveSaleList = () => {
    const dt = ref();
    const search = ref('');
    const selectedPaymentType = ref(null);
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
    const store = useSaleStore();

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

            await store.fetchApproved({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta),
                search: search.value,
                payment_type: paymentType,
            });

            const response = store.getAllResponse;

            if (response?.data) {
                let items = (response.data.data || [])
                    .map(mapSaleListItemFromApi)
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
            showApiErrorToast(error, 'Unable to load active sales.');
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
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useContractListExport({
        exportColumnsByList: SALE_EXPORT_COLUMNS_BY_LIST,
        listType: 'active',
        title: 'Active Sales',
        filenameBase: 'active-sales',
        emptyMessage: 'No active sales available to export.',
        getVisibleRows: () => contracts.value,
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            payment_type: normalizePaymentTypeFilter(selectedPaymentType.value),
        }),
        fetchPage: async (params) => {
            await store.fetchApproved(params);

            return store.getAllResponse;
        },
        mapItem: mapSaleListItemFromApi,
        applyFilters: applyExportFilters,
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
        [search, selectedPaymentType, dateFrom, dateTo],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 300),
    );

    return {
        dt,
        search,
        selectedPaymentType,
        dateFrom,
        dateTo,
        contracts,
        totalRecords,
        lazyParams,
        isLoading,
        onPage,
        onSort,
        resetSearch,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
        formatCurrency,
        getPaymentTypeLabel,
    };
};
