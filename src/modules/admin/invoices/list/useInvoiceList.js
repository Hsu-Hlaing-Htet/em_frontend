import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { formatDate, parseDate } from '@/utils/formatter';
import { formatPropertyUnit } from '@/helpers/invoices/invoiceDetailHelpers';
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
import { INVOICE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { service as buildingService } from '@/modules/admin/buildings/service';
import { useInvoiceStore } from '../store';

const mapInvoiceRow = (item) => ({
    ...item,
    customer_name: item.customer_name || '',
    building_name: item.building_name || '',
    room_number: item.room_number || '',
    property_unit: item.property_unit || formatPropertyUnit(item),
    payment_status: item.payment_status || item.display_status || item.status || '',
});

export const useInvoiceList = () => {
    const route = useRoute();
    const router = useRouter();
    const dt = ref();
    const { onRowClick } = useClickableListRow('invoiceDocument');
    const search = ref('');
    const paymentStatusFilter = ref(null);
    const buildingId = ref(null);
    const buildingOptions = ref([]);
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const invoices = ref([]);
    const lazyParams = ref({});
    const isHydratingFromUrl = ref(true);
    const isWritingQuery = ref(false);
    const store = useInvoiceStore();

    const loadBuildings = async () => {
        const response = await buildingService.getAll({ per_page: 100 });

        buildingOptions.value = (response?.data?.data || []).map((building) => ({
            label: building.building_name,
            value: building.id,
        }));
    };

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
        payment_status: paymentStatusFilter.value || undefined,
        building_id: buildingId.value || undefined,
        due_from: toQueryDate(dateFrom.value),
        due_to: toQueryDate(dateTo.value),
    });

    const applyQueryToFilters = (query) => {
        search.value = readQueryString(query, 'search', '');
        const statusFromQuery = readQueryString(query, 'payment_status', '') || null;
        paymentStatusFilter.value = statusFromQuery === 'unpaid' ? 'issued' : statusFromQuery;
        buildingId.value = readQueryNumber(query, 'building_id');
        dateFrom.value = readQueryDate(query, 'due_from', parseDate);
        dateTo.value = readQueryDate(query, 'due_to', parseDate);
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

        const params = omitEmptyParams({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            order: multisortConvert(lazyParams.value.multiSortMeta) || undefined,
            ...buildFilterQuery(),
        });

        await store.fetchAll(params);

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            invoices.value = (data.data || []).map(mapInvoiceRow);
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
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
        paymentStatusFilter.value = null;
        buildingId.value = null;
        dateFrom.value = null;
        dateTo.value = null;
        resetPagination();
        await syncFiltersToUrl();
        await loadingData();
    };

    watch(
        [search, paymentStatusFilter, buildingId, dateFrom, dateTo],
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
        await loadBuildings();
        isHydratingFromUrl.value = false;
        // Drop stale date_type / issued_* query keys from older URLs.
        await syncFiltersToUrl();
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
        title: 'Invoices',
        filenameBase: 'invoices',
        columns: INVOICE_EXPORT_COLUMNS,
        emptyMessage: 'No invoices available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta) || undefined,
            ...buildFilterQuery(),
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));
            return store.getAllResponse;
        },
        mapItem: mapInvoiceRow,
        getFilterSummary: () => {
            const dueFrom = toQueryDate(dateFrom.value) || '';
            const dueTo = toQueryDate(dateTo.value) || '';
            let dueDate = '';
            if (dueFrom && dueTo) {
                dueDate = `${dueFrom} - ${dueTo}`;
            } else if (dueFrom) {
                dueDate = `From ${dueFrom}`;
            } else if (dueTo) {
                dueDate = `Until ${dueTo}`;
            }

            return [
                { label: 'Search', value: search.value || '' },
                { label: 'Payment Status', value: paymentStatusFilter.value || '' },
                { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
                { label: 'Due Date', value: dueDate },
            ];
        },
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        invoices,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        paymentStatusFilter,
        buildingId,
        dateFrom,
        dateTo,
        buildingOptions,
        onSort,
        onPage,
        onRowClick,
        resetSearch,
        formatDate,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
