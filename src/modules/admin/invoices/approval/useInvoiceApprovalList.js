import { ref, watch, onMounted, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import { formatPropertyUnit } from '@/helpers/invoices/invoiceDetailHelpers';
import { useBuildingRoomFilterOptions } from '@/composables/admin/useBuildingRoomFilterOptions';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
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

export const useInvoiceApprovalList = () => {
    const paymentStatusFilter = ref(null);
    const buildingId = ref(null);
    const roomId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const dueFrom = ref(null);
    const dueTo = ref(null);
    const store = useInvoiceStore();

    const {
        buildingOptions,
        roomOptions,
        loadBuildings,
        loadRooms,
    } = useBuildingRoomFilterOptions(buildingId);

    const buildFilterParams = () => ({
        building_id: buildingId.value || undefined,
        room_id: roomId.value || undefined,
        issued_from: toQueryDate(issuedFrom.value),
        issued_to: toQueryDate(issuedTo.value),
        due_from: toQueryDate(dueFrom.value),
        due_to: toQueryDate(dueTo.value),
        payment_status: 'draft',
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'draft',
        approveMethod: 'issue',
        rejectMethod: null,
        autoLoad: false,
        getItemLabel: (item) => item.invoice_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending invoice approvals.',
        approveErrorMessage: 'Unable to approve invoice.',
        buildApproveSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} issued and sent to customer.`,
        buildFilterParams,
        mapItems: (rows) => rows.map(mapInvoiceRow),
        getWatchSources: () => [
            buildingId,
            roomId,
            issuedFrom,
            issuedTo,
            dueFrom,
            dueTo,
            paymentStatusFilter,
        ],
        resetFilters: () => {
            paymentStatusFilter.value = null;
            buildingId.value = null;
            roomId.value = null;
            issuedFrom.value = null;
            issuedTo.value = null;
            dueFrom.value = null;
            dueTo.value = null;
            roomOptions.value = [];
        },
    });

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Invoice Approvals',
        filenameBase: 'invoice-approvals',
        columns: INVOICE_EXPORT_COLUMNS,
        emptyMessage: 'No invoice approvals available to export.',
        getFetchParams: () => omitEmptyParams({
            order: multisortConvert(list.lazyParams.value.multiSortMeta) || undefined,
            search: list.search.value?.trim() || undefined,
            ...buildFilterParams(),
            status: 'draft',
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));

            return store.getAllResponse;
        },
        mapItem: mapInvoiceRow,
        getFilterSummary: () => [
            { label: 'Search', value: list.search.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomId.value)?.label || '' },
            { label: 'Issued From', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'Issued To', value: toQueryDate(issuedTo.value) || '' },
            { label: 'Due From', value: toQueryDate(dueFrom.value) || '' },
            { label: 'Due To', value: toQueryDate(dueTo.value) || '' },
            { label: 'Status', value: 'draft' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    watch(buildingId, async (nextBuildingId, previousBuildingId) => {
        if (nextBuildingId !== previousBuildingId) {
            roomId.value = null;
            await loadRooms(nextBuildingId);
        }
    });

    onMounted(async () => {
        await loadBuildings();
        await list.loadingData();
    });

    return {
        ...list,
        paymentStatusFilter,
        buildingId,
        roomId,
        issuedFrom,
        issuedTo,
        dueFrom,
        dueTo,
        buildingOptions,
        roomOptions,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
