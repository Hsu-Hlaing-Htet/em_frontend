import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { mapInvoiceLineItemRow } from '@/helpers/invoices/invoiceDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
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

function formatDisplayDate(value) {
    if (!value) {
        return '—';
    }

    const raw = typeof value === 'string' && !value.includes('T')
        ? `${value.slice(0, 10)}T00:00:00`
        : value;
    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
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
        created_at: '',
        status: '',
        proof_image_url: '',
        rejection_reason: '',
        receipt_id: null,
        receipt_number: '',
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

    const summaryItems = computed(() => [
        { label: 'Payment ID', value: paymentId.value },
        { label: 'Invoice No.', value: state.invoice_number || invoice.value.invoice_number || '—' },
        { label: 'Building', value: state.building_name || invoice.value.building_name || '—' },
        { label: 'Room', value: state.room_number || invoice.value.room_number || '—' },
        { label: 'Payment Date', value: formatDisplayDate(state.payment_date) },
        { label: 'Payment Method', value: state.payment_method_name || '—' },
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
