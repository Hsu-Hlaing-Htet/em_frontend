import { ref, onMounted, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
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

export const useReceiptApprovalList = () => {
    const paymentMethodId = ref(null);
    const issuedFrom = ref(null);
    const issuedTo = ref(null);
    const paymentMethodOptions = ref([]);
    const store = useReceiptStore();

    const buildFilterParams = () => ({
        payment_method_id: paymentMethodId.value || undefined,
        issued_from: toQueryDate(issuedFrom.value),
        issued_to: toQueryDate(issuedTo.value),
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        pendingStatusKey: 'approval_status',
        approveMethod: 'approve',
        rejectMethod: 'reject',
        detailRouteName: 'showReceiptApproval',
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
        getWatchSources: () => [paymentMethodId, issuedFrom, issuedTo],
        resetFilters: () => {
            paymentMethodId.value = null;
            issuedFrom.value = null;
            issuedTo.value = null;
        },
    });

    const loadPaymentMethods = async () => {
        const response = await paymentMethodService.getAll({ per_page: 100, status: 'active' });
        paymentMethodOptions.value = (response?.data?.data || []).map((method) => ({
            label: method.name,
            value: method.id,
        }));
    };

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
            { label: 'Payment Method', value: paymentMethodOptions.value.find((o) => o.value === paymentMethodId.value)?.label || '' },
            { label: 'From Date', value: toQueryDate(issuedFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(issuedTo.value) || '' },
        ],
        hasData: computed(() => list.totalRecords.value > 0),
    });

    onMounted(async () => {
        await loadPaymentMethods();
        await list.loadingData();
    });

    return {
        ...list,
        paymentMethodId,
        paymentMethodOptions,
        issuedFrom,
        issuedTo,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
