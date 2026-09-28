import { ref, watch, onMounted, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import { formatPropertyUnit } from '@/helpers/invoices/invoiceDetailHelpers';
import {
    buildLateFeeRuleOptions,
    lateFeeSelectionFromInvoice,
} from '@/helpers/invoices/lateFeePolicyHelpers';
import { useBuildingRoomFilterOptions } from '@/composables/admin/useBuildingRoomFilterOptions';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { INVOICE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { showApiErrorToast } from '@/utils/apiError';
import EventBus from '@/libs/AppEventBus';
import { useLateFeeStore } from '@/modules/admin/late-fees/store';
import { useInvoiceStore } from '../store';

const mapInvoiceRow = (item) => ({
    ...item,
    customer_name: item.customer_name || '',
    building_name: item.building_name || '',
    room_number: item.room_number || '',
    property_unit: item.property_unit || formatPropertyUnit(item),
    payment_status: item.payment_status || item.display_status || item.status || '',
    late_fee_selection: lateFeeSelectionFromInvoice(item),
    late_fee_policy_label: item.late_fee_policy?.label || '',
});

export const useInvoiceApprovalList = () => {
    const buildingId = ref(null);
    const roomId = ref(null);
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const lateFeeRuleOptions = ref([]);
    const savingLateFeeIds = ref([]);
    const store = useInvoiceStore();
    const lateFeeStore = useLateFeeStore();

    const {
        buildingOptions,
        roomOptions,
        loadBuildings,
        loadRooms,
    } = useBuildingRoomFilterOptions(buildingId);

    const buildFilterParams = () => ({
        building_id: buildingId.value || undefined,
        room_id: roomId.value || undefined,
        due_from: toQueryDate(dateFrom.value),
        due_to: toQueryDate(dateTo.value),
        payment_status: 'draft',
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'draft',
        approveMethod: 'issue',
        rejectMethod: 'delete',
        detailRouteName: 'invoiceApprovalDocument',
        autoLoad: false,
        getItemLabel: (item) => item.invoice_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending invoice approvals.',
        approveErrorMessage: 'Unable to approve invoice.',
        rejectErrorMessage: 'Unable to reject invoice.',
        buildApproveSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} issued and sent to customer.`,
        buildRejectSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} has been rejected.`,
        buildApprovePayload: (item) => ({
            id: item.id,
            late_fee_selection: item.late_fee_selection,
        }),
        buildFilterParams,
        mapItems: (rows) => rows.map(mapInvoiceRow),
        getWatchSources: () => [
            buildingId,
            roomId,
            dateFrom,
            dateTo,
        ],
        resetFilters: () => {
            buildingId.value = null;
            roomId.value = null;
            dateFrom.value = null;
            dateTo.value = null;
            roomOptions.value = [];
        },
    });

    const loadLateFeeOptions = async () => {
        try {
            await lateFeeStore.fetchOptions();
            const response = lateFeeStore.getOptionsResponse;
            const rules = Array.isArray(response?.data) ? response.data : [];
            lateFeeRuleOptions.value = buildLateFeeRuleOptions(rules);
        } catch (error) {
            lateFeeRuleOptions.value = buildLateFeeRuleOptions([]);
            showApiErrorToast(error, 'Unable to load Late Fee Rules.');
        }
    };

    const updateLateFeeSelection = async (item, selection) => {
        if (!item?.id || savingLateFeeIds.value.includes(item.id)) {
            return;
        }

        const previous = item.late_fee_selection;
        item.late_fee_selection = selection;
        savingLateFeeIds.value = [...savingLateFeeIds.value, item.id];

        try {
            await store.updateLateFeePolicy({
                id: item.id,
                late_fee_selection: selection,
            });
            const response = store.getActionResponse;
            if (response?.data) {
                Object.assign(item, mapInvoiceRow(response.data));
            }
        } catch (error) {
            item.late_fee_selection = previous;
            showApiErrorToast(error, 'Unable to update Late Fee Rule.');
        } finally {
            savingLateFeeIds.value = savingLateFeeIds.value.filter((id) => id !== item.id);
        }
    };

    const approveFromList = async (item) => {
        if (item.late_fee_selection == null || item.late_fee_selection === '') {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Please select a Late Fee Rule.',
            });
            return false;
        }

        return list.approveItem(item);
    };

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
        columns: INVOICE_EXPORT_COLUMNS.filter(
            (column) => column.field !== 'payment_status' && column.field !== 'issued_date',
        ),
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
            { label: 'Due From', value: toQueryDate(dateFrom.value) || '' },
            { label: 'Due To', value: toQueryDate(dateTo.value) || '' },
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
        await Promise.all([loadBuildings(), loadLateFeeOptions()]);
        await list.loadingData();
    });

    return {
        ...list,
        buildingId,
        roomId,
        dateFrom,
        dateTo,
        buildingOptions,
        roomOptions,
        lateFeeRuleOptions,
        updateLateFeeSelection,
        approveFromList,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
