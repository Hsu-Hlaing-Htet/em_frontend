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
import { useBuildingRoomFilterOptions } from '@/composables/admin/useBuildingRoomFilterOptions';
import { useListExport } from '@/composables/admin/useListExport';
import { INVOICE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
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
    const search = ref('');
    const paymentStatusFilter = ref(null);
    const buildingId = ref(null);
    const roomId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const dueFrom = ref(null);
    const dueTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const invoices = ref([]);
    const lazyParams = ref({});
    const isHydratingFromUrl = ref(true);
    const isWritingQuery = ref(false);
    const store = useInvoiceStore();
    const {
        buildingOptions,
        roomOptions,
        loadBuildings,
        loadRooms,
    } = useBuildingRoomFilterOptions(buildingId);

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
        room_id: roomId.value || undefined,
        issued_from: toQueryDate(issuedFrom.value),
        issued_to: toQueryDate(issuedTo.value),
        due_from: toQueryDate(dueFrom.value),
        due_to: toQueryDate(dueTo.value),
    });

    const applyQueryToFilters = (query) => {
        search.value = readQueryString(query, 'search', '');
        paymentStatusFilter.value = readQueryString(query, 'payment_status', '') || null;
        buildingId.value = readQueryNumber(query, 'building_id');
        roomId.value = readQueryNumber(query, 'room_id');
        issuedFrom.value = readQueryDate(query, 'issued_from', parseDate);
        issuedTo.value = readQueryDate(query, 'issued_to', parseDate);
        dueFrom.value = readQueryDate(query, 'due_from', parseDate);
        dueTo.value = readQueryDate(query, 'due_to', parseDate);
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
            issued_from: toQueryDate(issuedFrom.value),
            issued_to: toQueryDate(issuedTo.value),
            due_from: toQueryDate(dueFrom.value),
            due_to: toQueryDate(dueTo.value),
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
        roomId.value = null;
        issuedFrom.value = null;
        issuedTo.value = null;
        dueFrom.value = null;
        dueTo.value = null;
        roomOptions.value = [];
        resetPagination();
        await syncFiltersToUrl();
        await loadingData();
    };

    watch(buildingId, (nextBuildingId, previousBuildingId) => {
        if (isHydratingFromUrl.value) {
            return;
        }

        if (nextBuildingId !== previousBuildingId) {
            roomId.value = null;
        }
    });

    watch(
        [search, paymentStatusFilter, buildingId, roomId, issuedFrom, issuedTo, dueFrom, dueTo],
        () => {
            reloadFromFilters();
        },
    );

    watch(() => route.query, async (query) => {
        if (isWritingQuery.value || isHydratingFromUrl.value) {
            return;
        }

        applyQueryToFilters(query);
        await loadRooms(buildingId.value);
        resetPagination();
        await loadingData();
    });

    onMounted(async () => {
        resetPagination();
        applyQueryToFilters(route.query);
        await loadBuildings();
        await loadRooms(buildingId.value);
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
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Payment Status', value: paymentStatusFilter.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomId.value)?.label || '' },
            { label: 'Issued From', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'Issued To', value: toQueryDate(issuedTo.value) || '' },
            { label: 'Due From', value: toQueryDate(dueFrom.value) || '' },
            { label: 'Due To', value: toQueryDate(dueTo.value) || '' },
        ],
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
        roomId,
        issuedFrom,
        issuedTo,
        dueFrom,
        dueTo,
        buildingOptions,
        roomOptions,
        onSort,
        onPage,
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
