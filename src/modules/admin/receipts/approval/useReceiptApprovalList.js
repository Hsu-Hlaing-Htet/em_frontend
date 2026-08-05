import { ref, watch, onMounted, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import { formatPropertyUnit } from '@/helpers/payments/paymentListHelpers';
import { useBuildingRoomFilterOptions } from '@/composables/admin/useBuildingRoomFilterOptions';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
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
    display_status: item.display_status || item.approval_status || item.status || '',
});

export const useReceiptApprovalList = () => {
    const buildingId = ref(null);
    const roomId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const store = useReceiptStore();

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
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        pendingStatusKey: 'approval_status',
        approveMethod: 'approve',
        rejectMethod: 'reject',
        autoLoad: false,
        getItemLabel: (item) => item.receipt_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending receipt approvals.',
        approveErrorMessage: 'Unable to approve receipt.',
        rejectErrorMessage: 'Unable to reject receipt.',
        buildApproveSuccessMessage: (item, response) => response?.message
            || `${item.receipt_number || `#${item.id}`} approved successfully.`,
        buildRejectSuccessMessage: (item, response) => response?.message
            || `${item.receipt_number || `#${item.id}`} has been rejected.`,
        buildFilterParams,
        mapItems: (rows) => rows.map(mapReceiptRow),
        getWatchSources: () => [buildingId, roomId, issuedFrom, issuedTo],
        resetFilters: () => {
            buildingId.value = null;
            roomId.value = null;
            issuedFrom.value = null;
            issuedTo.value = null;
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
        title: 'Receipt Approvals',
        filenameBase: 'receipt-approvals',
        columns: RECEIPT_EXPORT_COLUMNS,
        emptyMessage: 'No receipt approvals available to export.',
        getFetchParams: () => omitEmptyParams({
            order: multisortConvert(list.lazyParams.value.multiSortMeta) || undefined,
            search: list.search.value?.trim() || undefined,
            ...buildFilterParams(),
            approval_status: 'pending',
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));

            return store.getAllResponse;
        },
        mapItem: mapReceiptRow,
        getFilterSummary: () => [
            { label: 'Search', value: list.search.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomId.value)?.label || '' },
            { label: 'Issued From', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'Issued To', value: toQueryDate(issuedTo.value) || '' },
            { label: 'Approval Status', value: 'pending' },
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
        buildingId,
        roomId,
        issuedFrom,
        issuedTo,
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
