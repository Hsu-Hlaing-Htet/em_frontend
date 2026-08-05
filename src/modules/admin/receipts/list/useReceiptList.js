import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { parseDate } from '@/utils/formatter';
import { formatPropertyUnit } from '@/helpers/payments/paymentListHelpers';
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
import { RECEIPT_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { useReceiptStore } from '../store';

const mapReceiptRow = (item) => ({
    ...item,
    customer_name: item.customer_name || '',
    property_unit: item.property_unit || formatPropertyUnit(item),
    invoice_amount: item.invoice_amount ?? 0,
    paid_amount: item.paid_amount ?? item.payment_amount ?? item.amount ?? 0,
    balance: item.balance ?? 0,
    payment_type: item.payment_type || '',
    payment_date: item.payment_date || '',
    payment_method_name: item.payment_method_name || '',
    display_status: item.display_status || item.status || '',
});

export const useReceiptList = () => {
    const route = useRoute();
    const router = useRouter();
    const dt = ref();
    const search = ref('');
    const buildingId = ref(null);
    const roomId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const statusFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const receipts = ref([]);
    const lazyParams = ref({});
    const isHydratingFromUrl = ref(true);
    const isWritingQuery = ref(false);
    const store = useReceiptStore();
    const errors = new Errors();
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
        building_id: buildingId.value || undefined,
        room_id: roomId.value || undefined,
        issued_from: toQueryDate(issuedFrom.value),
        issued_to: toQueryDate(issuedTo.value),
        status: statusFilter.value || undefined,
    });

    const applyQueryToFilters = (query) => {
        search.value = readQueryString(query, 'search', '');
        buildingId.value = readQueryNumber(query, 'building_id');
        roomId.value = readQueryNumber(query, 'room_id');
        issuedFrom.value = readQueryDate(query, 'issued_from', parseDate);
        issuedTo.value = readQueryDate(query, 'issued_to', parseDate);
        statusFilter.value = readQueryString(query, 'status', '') || null;
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
        buildingId.value = null;
        roomId.value = null;
        issuedFrom.value = null;
        issuedTo.value = null;
        statusFilter.value = null;
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
        [search, buildingId, roomId, issuedFrom, issuedTo, statusFilter],
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
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomId.value)?.label || '' },
            { label: 'Issued From', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'Issued To', value: toQueryDate(issuedTo.value) || '' },
            { label: 'Status', value: statusFilter.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        receipts,
        errors,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        buildingId,
        roomId,
        issuedFrom,
        issuedTo,
        statusFilter,
        buildingOptions,
        roomOptions,
        onSort,
        onPage,
        resetSearch,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
