import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { parseDate } from '@/utils/formatter';
import {
    omitEmptyParams,
    queriesEqual,
    readQueryDate,
    readQueryNumber,
    readQueryString,
    toQueryDate,
} from '@/helpers/lists/listQuery';
import { useListExport } from '@/composables/admin/useListExport';
import { useClickableListRow } from '@/composables/admin/useClickableListRow';
import { RECEIPT_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { service as paymentMethodService } from '@/modules/admin/payment-methods/service';
import { useReceiptStore } from '../store';

const mapReceiptRow = (item) => ({
    ...item,
    customer_name: item.customer_name || '',
    invoice_number: item.invoice_number || '',
    paid_amount: item.paid_amount ?? item.payment_amount ?? item.amount ?? 0,
    payment_date: item.payment_date || '',
    payment_method_name: item.payment_method_name || '',
});

export const useReceiptList = () => {
    const route = useRoute();
    const router = useRouter();
    const dt = ref();
    const { onRowClick } = useClickableListRow('receiptDocument');
    const search = ref('');
    const paymentMethodId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const paymentMethodOptions = ref([]);
    const statusFilter = ref('issued');
    const deliveryStatusFilter = ref('sent');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const receipts = ref([]);
    const lazyParams = ref({});
    const isHydratingFromUrl = ref(true);
    const isWritingQuery = ref(false);
    const store = useReceiptStore();

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

    const buildFilterQuery = () => omitEmptyParams({
        search: search.value?.trim() || undefined,
        payment_method_id: paymentMethodId.value || undefined,
        issued_from: toQueryDate(issuedFrom.value),
        issued_to: toQueryDate(issuedTo.value),
        status: statusFilter.value || undefined,
        delivery_status: deliveryStatusFilter.value || undefined,
    });

    const applyQueryToFilters = (query) => {
        search.value = readQueryString(query, 'search', '');
        paymentMethodId.value = readQueryNumber(query, 'payment_method_id');
        issuedFrom.value = readQueryDate(query, 'issued_from', parseDate);
        issuedTo.value = readQueryDate(query, 'issued_to', parseDate);
        statusFilter.value = readQueryString(query, 'status', '') || 'issued';
        deliveryStatusFilter.value = readQueryString(query, 'delivery_status', '') || 'sent';
    };

    const syncFiltersToUrl = async () => {
        const nextQuery = buildFilterQuery();

        if (queriesEqual(nextQuery, route.query)) {
            return;
        }

        isWritingQuery.value = true;

        try {
            await router.replace({ query: nextQuery });
        } finally {
            isWritingQuery.value = false;
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

        await store.fetchAll(omitEmptyParams({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            order: multisortConvert(lazyParams.value.multiSortMeta) || undefined,
            ...buildFilterQuery(),
        }));

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            receipts.value = (data.data || []).map(mapReceiptRow);
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
    };

    const loadPaymentMethods = async () => {
        const response = await paymentMethodService.getAll({ per_page: 100, status: 'active' });
        paymentMethodOptions.value = (response?.data?.data || []).map((method) => ({
            label: method.name,
            value: method.id,
        }));
    };

    const reloadFromFilters = useDebounceFn(async () => {
        if (isHydratingFromUrl.value) {
            return;
        }

        resetPagination();
        await syncFiltersToUrl();
        await loadingData();
    }, 500);

    const resetSearch = async () => {
        search.value = '';
        paymentMethodId.value = null;
        issuedFrom.value = null;
        issuedTo.value = null;
        statusFilter.value = 'issued';
        deliveryStatusFilter.value = 'sent';
        resetPagination();
        await syncFiltersToUrl();
        await loadingData();
    };

    watch(
        [search, paymentMethodId, issuedFrom, issuedTo, statusFilter, deliveryStatusFilter],
        () => {
            reloadFromFilters();
        },
    );

    watch(() => route.query, async (query) => {
        if (isWritingQuery.value || isHydratingFromUrl.value) {
            return;
        }

        applyQueryToFilters(query);
        resetPagination();
        await loadingData();
    });

    onMounted(async () => {
        resetPagination();
        applyQueryToFilters(route.query);
        isHydratingFromUrl.value = false;
        await loadPaymentMethods();
        await loadingData();
    });

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Receipts',
        filenameBase: 'receipts',
        columns: RECEIPT_EXPORT_COLUMNS,
        emptyMessage: 'No receipts available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta) || undefined,
            ...buildFilterQuery(),
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));
            return store.getAllResponse;
        },
        mapItem: mapReceiptRow,
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Method', value: paymentMethodOptions.value.find((o) => o.value === paymentMethodId.value)?.label || '' },
            { label: 'From Date', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(issuedTo.value) || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        receipts,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        paymentMethodId,
        paymentMethodOptions,
        issuedFrom,
        issuedTo,
        onSort,
        onPage,
        onRowClick,
        resetSearch,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
