import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@/utils/debounce';
import { parseDate } from '@/utils/formatter';
import {
    formatPropertyUnit,
    resolvePaymentListStatus,
} from '@/helpers/payments/paymentListHelpers';
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
import { PAYMENT_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import {
    PAYMENT_LIST_STATUS_OPTIONS,
    PAYMENT_TYPE_FILTER_OPTIONS,
} from '@/constants/constant';
import { service as paymentMethodService } from '@/modules/admin/payment-methods/service';
import { usePaymentStore } from '../store';

export const usePaymentList = () => {
    const route = useRoute();
    const router = useRouter();
    const dt = ref();
    const { onRowClick } = useClickableListRow('showPayment');
    const search = ref('');
    const paymentType = ref(null);
    const paymentMethodId = ref(null);
    const status = ref(null);
    const paymentDateFrom = ref(null);
    const paymentDateTo = ref(null);
    const paymentMethodOptions = ref([]);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const payments = ref([]);
    const lazyParams = ref({});
    const isHydratingFromUrl = ref(true);
    const isWritingQuery = ref(false);
    const store = usePaymentStore();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            first: 0,
        };
    };

    const mapPaymentRow = (item) => ({
        ...item,
        property_unit: item.property_unit || formatPropertyUnit(item),
        display_status: resolvePaymentListStatus(item),
        paid_amount: item.paid_amount ?? item.amount,
        balance: item.balance ?? 0,
        payment_method_name: item.payment_method_name || '',
        customer_name: item.customer_name || '',
        invoice_number: item.invoice_number || '',
        invoice_amount: item.invoice_amount ?? 0,
    });

    const buildFilterQuery = () => omitEmptyParams({
        search: search.value?.trim() || undefined,
        payment_type: paymentType.value || undefined,
        payment_method_id: paymentMethodId.value || undefined,
        status: status.value || undefined,
        payment_date_from: toQueryDate(paymentDateFrom.value),
        payment_date_to: toQueryDate(paymentDateTo.value),
    });

    const applyQueryToFilters = (query) => {
        search.value = readQueryString(query, 'search', '');
        paymentType.value = readQueryString(query, 'payment_type', null);
        paymentMethodId.value = readQueryNumber(query, 'payment_method_id');
        status.value = readQueryString(query, 'status', null);
        paymentDateFrom.value = readQueryDate(query, 'payment_date_from', parseDate);
        paymentDateTo.value = readQueryDate(query, 'payment_date_to', parseDate);
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

    const loadingData = async () => {
        isLoading.value = true;

        await store.fetchAll(omitEmptyParams({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            ...buildFilterQuery(),
        }));

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            payments.value = (data.data || []).map(mapPaymentRow);
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
        paymentType.value = null;
        paymentMethodId.value = null;
        status.value = null;
        paymentDateFrom.value = null;
        paymentDateTo.value = null;
        resetPagination();
        await syncFiltersToUrl();
        await loadingData();
    };

    watch(
        [
            search,
            paymentType,
            paymentMethodId,
            status,
            paymentDateFrom,
            paymentDateTo,
        ],
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
        await loadPaymentMethods();
        isHydratingFromUrl.value = false;
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
        title: 'Payments',
        filenameBase: 'payments',
        columns: PAYMENT_EXPORT_COLUMNS,
        emptyMessage: 'No payments available to export.',
        getFetchParams: () => ({
            ...buildFilterQuery(),
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));
            return store.getAllResponse;
        },
        mapItem: mapPaymentRow,
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Type', value: PAYMENT_TYPE_FILTER_OPTIONS.find((o) => o.value === paymentType.value)?.label || '' },
            { label: 'Payment Method', value: paymentMethodOptions.value.find((o) => o.value === paymentMethodId.value)?.label || '' },
            { label: 'Status', value: PAYMENT_LIST_STATUS_OPTIONS.find((o) => o.value === status.value)?.label || '' },
            { label: 'From Date', value: toQueryDate(paymentDateFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(paymentDateTo.value) || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        payments,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        paymentType,
        paymentMethodId,
        status,
        paymentDateFrom,
        paymentDateTo,
        paymentTypeOptions: PAYMENT_TYPE_FILTER_OPTIONS.filter((option) => option.value !== null),
        paymentMethodOptions,
        statusOptions: PAYMENT_LIST_STATUS_OPTIONS,
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
