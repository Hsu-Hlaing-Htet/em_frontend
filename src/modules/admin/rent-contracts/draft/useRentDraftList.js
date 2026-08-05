import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import EventBus from '@/libs/AppEventBus';
import { formatCurrency, getPaymentTypeLabel } from '@/utils/formatter';
import { filterContracts, normalizePaymentTypeFilter } from '@/helpers/contracts/contractFilters';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentContractDraftStore } from '../store';
import { mapRentDraftFromApi } from './mapRentDraft';
import { useContractListExport } from '@/composables/admin/contracts/useContractListExport';
import { RENT_EXPORT_COLUMNS_BY_LIST } from '@/helpers/contracts/exportColumns';

export const useRentDraftList = () => {
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
    const store = useRentContractDraftStore();
    const { confirmDelete } = useDeleteConfirm();

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            multiSortMeta: [],
            first: 0,
        };
    };

    const mapListItem = (item) => {
        const mapped = mapRentDraftFromApi(item);

        if (!mapped) {
            return null;
        }

        return {
            id: mapped.id,
            contract_no: mapped.contract_no,
            customer_name: mapped.customer_name,
            building_name: mapped.building_name,
            room_number: mapped.room_number,
            contract_total: mapped.contract_total,
            payment_type: mapped.payment_type,
            status: mapped.status,
            created_by: item.created_by_name || mapped.created_by || '',
            created_at: mapped.created_at,
        };
    };

    const loadingData = async () => {
        isLoading.value = true;

        try {
            const paymentType = normalizePaymentTypeFilter(selectedPaymentType.value);

            await store.fetchAll({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta),
                search: search.value,
                payment_type: paymentType,
            });

            const response = store.getAllResponse;

            if (response?.data) {
                let items = (response.data.data || []).map(mapListItem);

                items = filterContracts(items, {
                    search: '',
                    dateFrom: dateFrom.value,
                    dateTo: dateTo.value,
                });

                contracts.value = items;
                totalRecords.value = response.data.total;
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load rent contract drafts.');
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

    const showConfirmDialog = (id, contractNo) => {
        confirmDelete(`Are you sure you want to delete ${contractNo}?`, async () => {
            try {
                await store.delete({ id });
                const response = store.getDeleteResponse;

                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response?.message || 'Rent contract draft deleted successfully.',
                });

                await loadingData();
            } catch (error) {
                showApiErrorToast(error, 'Unable to delete rent contract draft.');
            }
        });
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
        listType: 'drafts',
        title: 'Rent Drafts',
        filenameBase: 'rent-drafts',
        emptyMessage: 'No rent contract drafts available to export.',
        getVisibleRows: () => contracts.value,
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            payment_type: normalizePaymentTypeFilter(selectedPaymentType.value),
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);

            return store.getAllResponse;
        },
        mapItem: mapListItem,
        applyFilters: applyExportFilters,
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Plan', value: (typeof getPaymentTypeLabel === 'function' ? getPaymentTypeLabel(selectedPaymentType.value) : selectedPaymentType.value) || '' },
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
        showConfirmDialog,
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
