import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import EventBus from '@/libs/AppEventBus';
import { formatCurrency, getPaymentTypeLabel } from '@/utils/formatter';
import { filterContracts, normalizePaymentTypeFilter } from '@/helpers/contracts/contractFilters';
import { showApiErrorToast } from '@/utils/apiError';
import { generateInvoiceForContract } from '@/composables/admin/contracts/generateInvoiceForContract';
import { useRentStore } from '../store';
import { mapRentListItemFromApi } from '../mapRent';
import { useContractListExport } from '@/composables/admin/contracts/useContractListExport';
import { RENT_EXPORT_COLUMNS_BY_LIST } from '@/helpers/contracts/exportColumns';

export const useRentContractApprovalList = () => {
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

            await store.fetchDrafts({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta),
                search: search.value,
                payment_type: paymentType,
            });

            const response = store.getAllResponse;

            if (response?.data) {
                let items = (response.data.data || [])
                    .map(mapRentListItemFromApi)
                    .filter(Boolean);

                items = filterContracts(items, {
                    search: '',
                    status: 'draft',
                    dateFrom: dateFrom.value,
                    dateTo: dateTo.value,
                    dateField: 'created_at',
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
            showApiErrorToast(error, 'Unable to load pending rent approvals.');
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
        status: 'draft',
        dateFrom: dateFrom.value,
        dateTo: dateTo.value,
        dateField: 'created_at',
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
        listType: 'approvals',
        title: 'Rent Contract Approvals',
        filenameBase: 'rent-contract-approvals',
        emptyMessage: 'No pending rent contracts available to export.',
        getVisibleRows: () => contracts.value,
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            payment_type: normalizePaymentTypeFilter(selectedPaymentType.value),
        }),
        fetchPage: async (params) => {
            await store.fetchDrafts(params);

            return store.getAllResponse;
        },
        mapItem: mapRentListItemFromApi,
        applyFilters: applyExportFilters,
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Plan', value: (typeof getPaymentTypeLabel === 'function' ? getPaymentTypeLabel(selectedPaymentType.value) : selectedPaymentType.value) || '' },
            { label: 'From Date', value: dateFrom.value ? String(dateFrom.value).slice(0, 10) : '' },
            { label: 'To Date', value: dateTo.value ? String(dateTo.value).slice(0, 10) : '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    const approveContract = async (contract) => {
        try {
            await store.approve({ id: contract.id });

            const response = store.getActionResponse;
            const approvedContract = response?.data || { ...contract, type: 'rent' };

            try {
                await generateInvoiceForContract(approvedContract);
            } catch (error) {
                showApiErrorToast(error, 'Contract approved, but invoice generation failed.');
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || `${contract.contract_no} approved and moved to Active Rents.`,
            });

            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, 'Unable to approve rent contract.');

            return false;
        }
    };

    const rejectContract = async (contract, reason) => {
        try {
            await store.reject({
                id: contract.id,
                rejection_reason: reason,
            });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: response?.message || `${contract.contract_no} has been rejected.`,
            });

            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, 'Unable to reject rent contract.');

            return false;
        }
    };

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
        approveContract,
        rejectContract,
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
