import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { mapInvoiceLineItemRow } from '@/helpers/invoices/invoiceDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
import { formatProjectDate } from '@/utils/timezone';
import { useCustomerPaymentStore } from '@/modules/customer/payments/store';

function normalizeRows(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    return [];
}

function formatMoney(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return formatCurrency(Number(value || 0));
}

function normalizePayment(data = {}) {
    const invoice = data.invoice_summary || data.invoice || {};

    return {
        ...data,
        invoice_summary: {
            ...invoice,
            items: normalizeRows(invoice.items),
        },
    };
}

export default function useCustomerShowPayment() {
    const route = useRoute();
    const store = useCustomerPaymentStore();
    const isLoading = ref(true);
    const showProofPreview = ref(false);
    const state = reactive({
        id: null,
        invoice_id: null,
        invoice_number: '',
        building_name: '',
        room_number: '',
        payment_date: '',
        payment_method_name: '',
        reference_number: '',
        amount: null,
        amount_received: null,
        refund_amount: null,
        invoice_subtotal: null,
        invoice_late_fee: null,
        invoice_amount: null,
        financial_summary: null,
        created_at: '',
        status: '',
        proof_image_url: '',
        rejection_reason: '',
        receipt_id: null,
        receipt_number: '',
        paid_by: '',
        submitted_by_name: '',
        submitted_by_user_id: null,
        invoice_summary: {
            items: [],
        },
    });

    const loadPayment = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, normalizePayment(response.data));
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment details.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (id) => {
        if (id) {
            loadPayment();
        }
    });

    onMounted(loadPayment);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const invoice = computed(() => state.invoice_summary || {});
    const financialSummary = computed(() => state.financial_summary || null);
    const paymentId = computed(() => (state.id ? `PAY-${String(state.id).padStart(5, '0')}` : '—'));
    const paymentStatus = computed(() => state.status || state.display_status || '—');
    const isPending = computed(() => String(state.status || '').toLowerCase() === 'pending');
    const isRejected = computed(() => String(state.status || '').toLowerCase() === 'rejected');
    const isApproved = computed(() => String(state.status || '').toLowerCase() === 'approved');
    const isOverdue = computed(() => Number(invoice.value.overdue_days || 0) > 0
        || String(invoice.value.status || '').toLowerCase() === 'overdue');

    const invoiceRows = computed(() => normalizeRows(invoice.value.items)
        .map((item) => mapInvoiceLineItemRow(item, formatMoney)));

    const lateFeeDescription = computed(() => {
        if (!isOverdue.value || Number(invoice.value.late_fee || 0) <= 0) {
            return '';
        }

        const days = Number(invoice.value.chargeable_overdue_days || invoice.value.overdue_days || 0);
        const rule = invoice.value.late_fee_rule_name || 'current late-fee rule';

        return `Late fee: ${formatMoney(invoice.value.late_fee)} calculated for ${days} overdue day${days === 1 ? '' : 's'} using ${rule}.`;
    });

    const financialRows = computed(() => {
        const summary = financialSummary.value;

        if (summary) {
            const showChange = Boolean(summary.show_change);

            return {
                subtotal: formatMoney(summary.subtotal),
                lateFee: formatMoney(summary.late_fee),
                total: formatMoney(summary.total),
                paid: formatMoney(summary.paid),
                settlementLabel: showChange ? 'Change' : 'Balance',
                settlementValue: formatMoney(showChange ? summary.change : (summary.balance ?? 0)),
            };
        }

        const subtotal = Number(state.invoice_subtotal ?? invoice.value.total_amount ?? 0);
        const lateFee = Number(state.invoice_late_fee ?? invoice.value.late_fee ?? 0);
        const total = Number(state.invoice_amount ?? (subtotal + lateFee));
        const paid = state.amount_received != null && state.amount_received !== ''
            ? Number(state.amount_received)
            : Number(state.amount ?? 0);
        const change = Number(state.refund_amount || 0);
        const showChange = change > 0;

        return {
            subtotal: formatMoney(subtotal),
            lateFee: formatMoney(lateFee),
            total: formatMoney(total),
            paid: formatMoney(paid),
            settlementLabel: showChange ? 'Change' : 'Balance',
            settlementValue: formatMoney(showChange ? change : 0),
        };
    });

    const summaryItems = computed(() => [
        { label: 'Payment ID', value: paymentId.value },
        { label: 'Invoice No.', value: state.invoice_number || invoice.value.invoice_number || '—' },
        { label: 'Building', value: state.building_name || invoice.value.building_name || '—' },
        { label: 'Room', value: state.room_number || invoice.value.room_number || '—' },
        { label: 'Payment Date', value: formatProjectDate(state.payment_date) || '—' },
        { label: 'Payment Method', value: state.payment_method_name || '—' },
        { label: 'Paid By', value: state.paid_by || '—' },
        { label: 'Reference No.', value: state.reference_number || state.invoice_number || '—' },
        { label: 'Submitted Date/Time', value: formatBillingDocumentDate(state.created_at) || '—' },
    ]);

    const invoiceRoute = computed(() => (
        (state.invoice_id || invoice.value.id)
            ? { name: 'customerInvoiceDocument', params: { id: state.invoice_id || invoice.value.id } }
            : null
    ));

    const makePaymentAgainRoute = computed(() => (
        (state.invoice_id || invoice.value.id)
            ? {
                name: 'customerShowInvoice',
                params: { id: state.invoice_id || invoice.value.id },
                hash: '#make-payment',
            }
            : null
    ));

    const receiptRoute = computed(() => (
        state.receipt_id ? { name: 'customerShowReceipt', params: { id: state.receipt_id } } : null
    ));

    return {
        isLoading,
        showProofPreview,
        state,
        invoice,
        summaryItems,
        invoiceRows,
        financialRows,
        paymentStatus,
        isPending,
        isRejected,
        isApproved,
        isOverdue,
        lateFeeDescription,
        invoiceRoute,
        makePaymentAgainRoute,
        receiptRoute,
        formatMoney,
    };
}
