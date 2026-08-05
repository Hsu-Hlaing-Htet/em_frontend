import { ref, watch, onMounted, computed } from 'vue';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import {
    formatPropertyUnit,
    resolvePaymentListStatus,
} from '@/helpers/payments/paymentListHelpers';
import { useBuildingRoomFilterOptions } from '@/composables/admin/useBuildingRoomFilterOptions';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { PAYMENT_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { service as paymentMethodService } from '@/modules/admin/payment-methods/service';
import { usePaymentStore } from '../store';

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

export const usePaymentApprovalList = () => {
    const buildingId = ref(null);
    const roomId = ref(null);
    const paymentMethodId = ref(null);
    const paymentDateFrom = ref(null);
    const paymentDateTo = ref(null);
    const paymentMethodOptions = ref([]);
    const store = usePaymentStore();

    const {
        buildingOptions,
        roomOptions,
        loadBuildings,
        loadRooms,
    } = useBuildingRoomFilterOptions(buildingId);

    const buildFilterParams = () => ({
        building_id: buildingId.value || undefined,
        room_id: roomId.value || undefined,
        payment_method_id: paymentMethodId.value || undefined,
        payment_date_from: toQueryDate(paymentDateFrom.value),
        payment_date_to: toQueryDate(paymentDateTo.value),
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        rejectMethod: 'reject',
        autoLoad: false,
        getItemLabel: (item) => item.invoice_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending payment approvals.',
        approveErrorMessage: 'Unable to approve payment.',
        rejectErrorMessage: 'Unable to reject payment.',
        buildApproveSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} approved. A draft receipt has been created for review.`,
        buildFilterParams,
        mapItems: (rows) => rows.map(mapPaymentRow),
        getWatchSources: () => [
            buildingId,
            roomId,
            paymentMethodId,
            paymentDateFrom,
            paymentDateTo,
        ],
        resetFilters: () => {
            buildingId.value = null;
            roomId.value = null;
            paymentMethodId.value = null;
            paymentDateFrom.value = null;
            paymentDateTo.value = null;
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
        title: 'Payment Approvals',
        filenameBase: 'payment-approvals',
        columns: PAYMENT_EXPORT_COLUMNS,
        emptyMessage: 'No payment approvals available to export.',
        getFetchParams: () => omitEmptyParams({
            search: list.search.value?.trim() || undefined,
            ...buildFilterParams(),
            status: 'pending',
        }),
        fetchPage: async (params) => {
            await store.fetchAll(omitEmptyParams(params));

            return store.getAllResponse;
        },
        mapItem: mapPaymentRow,
        getFilterSummary: () => [
            { label: 'Search', value: list.search.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === buildingId.value)?.label || '' },
            { label: 'Room', value: roomOptions.value.find((o) => o.value === roomId.value)?.label || '' },
            { label: 'Payment Method', value: paymentMethodOptions.value.find((o) => o.value === paymentMethodId.value)?.label || '' },
            { label: 'Payment From', value: toQueryDate(paymentDateFrom.value) || '' },
            { label: 'Payment To', value: toQueryDate(paymentDateTo.value) || '' },
            { label: 'Status', value: 'pending' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    const loadPaymentMethods = async () => {
        const response = await paymentMethodService.getAll({ per_page: 100, status: 'active' });
        paymentMethodOptions.value = (response?.data?.data || []).map((method) => ({
            label: method.name,
            value: method.id,
        }));
    };

    watch(buildingId, async (nextBuildingId, previousBuildingId) => {
        if (nextBuildingId !== previousBuildingId) {
            roomId.value = null;
            await loadRooms(nextBuildingId);
        }
    });

    onMounted(async () => {
        await Promise.all([loadBuildings(), loadPaymentMethods()]);
        await list.loadingData();
    });

    return {
        ...list,
        buildingId,
        roomId,
        paymentMethodId,
        paymentDateFrom,
        paymentDateTo,
        buildingOptions,
        roomOptions,
        paymentMethodOptions,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
