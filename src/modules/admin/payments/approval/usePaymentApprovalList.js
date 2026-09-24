import { ref, onMounted, computed } from 'vue';
import { omitEmptyParams, toQueryDate } from '@/helpers/lists/listQuery';
import {
    formatPropertyUnit,
    resolvePaymentListStatus,
} from '@/helpers/payments/paymentListHelpers';
import { useEntityApprovalList } from '@/composables/global/useEntityApprovalList';
import { useListExport } from '@/composables/admin/useListExport';
import { PAYMENT_APPROVAL_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';
import { PAYMENT_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { service as paymentMethodService } from '@/modules/admin/payment-methods/service';
import { usePaymentStore } from '../store';

const mapPaymentRow = (item) => ({
    ...item,
    property_unit: item.property_unit || formatPropertyUnit(item),
    display_status: resolvePaymentListStatus(item),
    // Submitted/frozen payment amount from payments.amount — never invent from live invoice balance.
    amount: item.amount == null || item.amount === '' ? null : Number(item.amount),
    paid_amount: item.paid_amount ?? item.amount,
    balance: item.balance ?? 0,
    payment_method_name: item.payment_method_name || '',
    customer_name: item.customer_name || '',
    invoice_number: item.invoice_number || '',
    invoice_amount: item.invoice_amount ?? 0,
});

export const usePaymentApprovalList = () => {
    const paymentType = ref(null);
    const paymentMethodId = ref(null);
    const paymentDateFrom = ref(null);
    const paymentDateTo = ref(null);
    const paymentMethodOptions = ref([]);
    const store = usePaymentStore();

    const buildFilterParams = () => ({
        payment_type: paymentType.value || undefined,
        payment_method_id: paymentMethodId.value || undefined,
        payment_date_from: toQueryDate(paymentDateFrom.value),
        payment_date_to: toQueryDate(paymentDateTo.value),
    });

    const list = useEntityApprovalList({
        store,
        pendingStatus: 'pending',
        rejectMethod: 'reject',
        detailRouteName: 'showPaymentApproval',
        autoLoad: false,
        getItemLabel: (item) => item.invoice_number || `#${item.id}`,
        loadErrorMessage: 'Unable to load pending payment approvals.',
        approveErrorMessage: 'Unable to approve payment.',
        rejectErrorMessage: 'Unable to reject payment.',
        buildApproveSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} approved. Receipt is ready in Receipts.`,
        buildRejectSuccessMessage: (item, response) => response?.message
            || `${item.invoice_number || `#${item.id}`} has been rejected.`,
        buildFilterParams,
        mapItems: (rows) => rows.map(mapPaymentRow),
        getWatchSources: () => [
            paymentType,
            paymentMethodId,
            paymentDateFrom,
            paymentDateTo,
        ],
        resetFilters: () => {
            paymentType.value = null;
            paymentMethodId.value = null;
            paymentDateFrom.value = null;
            paymentDateTo.value = null;
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
        columns: PAYMENT_APPROVAL_EXPORT_COLUMNS,
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
            { label: 'Payment Type', value: PAYMENT_TYPE_FILTER_OPTIONS.find((o) => o.value === paymentType.value)?.label || '' },
            { label: 'Payment Method', value: paymentMethodOptions.value.find((o) => o.value === paymentMethodId.value)?.label || '' },
            { label: 'From Date', value: toQueryDate(paymentDateFrom.value) || '' },
            { label: 'To Date', value: toQueryDate(paymentDateTo.value) || '' },
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

    onMounted(async () => {
        await loadPaymentMethods();
        await list.loadingData();
    });

    return {
        ...list,
        paymentType,
        paymentMethodId,
        paymentDateFrom,
        paymentDateTo,
        paymentTypeOptions: PAYMENT_TYPE_FILTER_OPTIONS.filter((option) => option.value !== null),
        paymentMethodOptions,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
