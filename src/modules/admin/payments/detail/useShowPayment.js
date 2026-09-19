import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { mapInvoiceLineItemRow } from '@/helpers/invoices/invoiceDetailHelpers';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { service as invoiceService } from '@/modules/admin/invoices/service';
import { usePaymentStore } from '../store';

function normalizeRows(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    return [];
}

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function normalizePaymentDetail(data = {}) {
    const invoice = data.invoice || {};
    const contract = invoice.contract || data.contract || {};
    const customer = contract.user || data.customer || data.user || {};
    const profile = customer.profile || data.profile || {};
    const room = contract.room || data.room || {};
    const building = room.building || data.building || {};

    return {
        ...data,
        invoice_id: data.invoice_id ?? invoice.id ?? null,
        invoice_number: data.invoice_number ?? invoice.invoice_number ?? '',
        invoice_type: data.invoice_type ?? invoice.type ?? '',
        // Submitted/frozen payment amount (payments.amount), not live invoice balance.
        amount: data.amount == null || data.amount === '' ? null : Number(data.amount),
        amount_received: data.amount_received == null || data.amount_received === ''
            ? null
            : Number(data.amount_received),
        refund_amount: data.refund_amount == null || data.refund_amount === ''
            ? null
            : Number(data.refund_amount),
        status: data.status ?? data.payment_status ?? '',
        display_status: data.display_status ?? invoice.status ?? data.status ?? '',
        customer_name: data.customer_name ?? customer.name ?? '',
        customer_email: data.customer_email ?? customer.email ?? '',
        customer_phone: data.customer_phone ?? profile.phone ?? customer.phone ?? '',
        building_name: data.building_name ?? building.building_name ?? room.building_name ?? '',
        room_number: data.room_number ?? room.room_number ?? '',
        created_at: data.created_at ?? data.submitted_at ?? '',
    };
}

export default function useShowPayment() {
    const store = usePaymentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const workflowLoading = ref({ approve: false, reject: false });
    const proofPreview = ref('');
    const showProofPreview = ref(false);
    const showApproveDialog = ref(false);
    const showRejectDialog = ref(false);
    const adminRemark = ref('');
    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'paymentApprovalList' }
            : { name: 'paymentList' }
    ));

    const state = reactive({
        id: null,
        invoice_id: null,
        payment_method_id: null,
        payment_method_name: '',
        payment_method_type: '',
        payment_type: '',
        amount: null,
        amount_received: null,
        refund_amount: null,
        invoice_amount: 0,
        paid_amount: 0,
        balance: 0,
        proof_image_path: '',
        proof_image_url: '',
        note: '',
        rejection_reason: '',
        payment_date: '',
        status: '',
        approved_at: '',
        invoice_number: '',
        customer_email: '',
        created_by_name: '',
        approved_by_name: '',
        building_name: '',
        room_number: '',
        customer_name: '',
        customer_phone: '',
        display_status: '',
        reference_number: '',
        created_at: '',
        receipt_id: null,
        receipt_number: '',
        receipt_status: '',
    });

    const invoiceSummary = reactive({
        id: null,
        invoice_number: '',
        total_amount: 0,
        late_fee: 0,
        amount_due: 0,
        paid_amount: 0,
        remaining_balance: 0,
        items: [],
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchPayment();
        }
    });

    onMounted(() => {
        fetchPayment();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const loadInvoiceSummary = async (invoiceId) => {
        Object.assign(invoiceSummary, {
            id: null,
            invoice_number: '',
            total_amount: 0,
            late_fee: 0,
            amount_due: 0,
            paid_amount: 0,
            remaining_balance: 0,
            items: [],
        });

        if (!invoiceId) {
            return;
        }

        try {
            const response = await invoiceService.getOne({ id: invoiceId });

            if (response?.data) {
                Object.assign(invoiceSummary, {
                    ...response.data,
                    items: normalizeRows(response.data.items),
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoice summary.');
        }
    };

    const fetchPayment = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                const payment = normalizePaymentDetail(response.data);

                Object.assign(state, payment);
                proofPreview.value = payment.proof_image_url || '';
                adminRemark.value = '';
                await loadInvoiceSummary(payment.invoice_id);
            }
        } finally {
            isLoading.value = false;
        }
    };

    const canReviewPayment = computed(() => (
        isApprovalView.value && state.status === 'pending'
    ));

    const remainingAfterPaidAmount = computed(() => {
        const currentBalance = Number(state.balance || 0);
        const paid = Number(state.amount || 0);

        return Math.max(roundMoney(currentBalance - paid), 0);
    });

    const displayRemainingBalance = computed(() => {
        if (canReviewPayment.value) {
            return remainingAfterPaidAmount.value;
        }

        return Number(
            invoiceSummary.remaining_balance ?? state.balance ?? 0,
        );
    });

    const paidAmountError = computed(() => {
        if (!canReviewPayment.value) {
            return '';
        }

        if (state.amount == null || state.amount === '') {
            return 'Paid Amount is required.';
        }

        const paid = Number(state.amount);
        const balance = Number(state.balance || 0);

        if (!Number.isFinite(paid) || paid <= 0) {
            return 'Paid Amount must be greater than zero.';
        }

        if (Math.abs(roundMoney(paid) - roundMoney(balance)) > 0.009) {
            return 'Paid Amount must match the current balance.';
        }

        return '';
    });

    const isPaidAmountValid = computed(() => !paidAmountError.value
        && state.amount != null
        && Number(state.amount) > 0);

    const confirmReject = async (reason) => {
        await runWorkflow('reject', { rejection_reason: reason });
    };

    const handleReject = async () => {
        const reason = adminRemark.value.trim();

        if (!reason) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Reject requires a reason.',
            });

            return;
        }

        await confirmReject(reason);
    };

    const runWorkflow = async (action, payload = {}) => {
        if (workflowLoading.value.approve || workflowLoading.value.reject) {
            return;
        }

        if ((action === 'approve' && !canApprove()) || (action === 'reject' && !canReject())) {
            return;
        }

        if (action === 'approve' && !isPaidAmountValid.value) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: paidAmountError.value || 'Enter a valid Paid Amount before approving.',
            });

            return;
        }

        workflowLoading.value[action] = true;

        try {
            if (action === 'approve') {
                await store.approve({
                    id: state.id,
                    amount: Number(state.amount),
                });
            } else {
                await store.reject({
                    id: state.id,
                    ...payload,
                });
            }

            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, normalizePaymentDetail(response.data || {}));
                EventBus.emit('show-toast', {
                    severity: action === 'reject' ? 'warn' : 'success',
                    summary: '',
                    detail: response.message,
                });

                showApproveDialog.value = false;
                showRejectDialog.value = false;

                if (isApprovalView.value) {
                    await router.push(
                        action === 'approve'
                            ? { name: 'showPayment', params: { id: state.id } }
                            : { name: 'paymentApprovalList' },
                    );
                }
            }
        } catch (error) {
            showApiErrorToast(
                error,
                action === 'approve' ? 'Unable to approve payment.' : 'Unable to reject payment.',
            );
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const canShowApprove = () => canReviewPayment.value;
    const canApprove = () => canReviewPayment.value && isPaidAmountValid.value;
    const canReject = () => canReviewPayment.value;

    const paymentId = computed(() => (
        state.id ? `PAY-${String(state.id).padStart(5, '0')}` : '—'
    ));
    const paymentStatus = computed(() => state.status || state.display_status);
    const formattedCreatedAt = computed(() => (
        formatBillingDocumentDate(state.created_at || state.submitted_at) || '—'
    ));
    const formattedPaymentDate = computed(() => formatDate(state.payment_date) || '—');
    const formattedVerifiedDate = computed(() => (
        formatBillingDocumentDate(state.approved_at) || formatDate(state.approved_at) || '—'
    ));

    const invoiceRows = computed(() => normalizeRows(invoiceSummary.items)
        .map((item) => mapInvoiceLineItemRow(item, formatCurrency)));

    const lateFeeAmount = computed(() => Number(invoiceSummary.late_fee || 0));
    const showLateFee = computed(() => lateFeeAmount.value > 0);
    const subTotalDisplay = computed(() => formatCurrency(Number(invoiceSummary.total_amount || 0)));
    const lateFeeDisplay = computed(() => formatCurrency(lateFeeAmount.value));
    const totalDisplay = computed(() => {
        // Frozen amount due on the payment submission takes priority for approval/detail.
        if (state.amount != null && state.amount !== '') {
            return formatCurrency(Number(state.amount));
        }

        const total = Number(invoiceSummary.amount_due);

        if (Number.isFinite(total) && total > 0) {
            return formatCurrency(total);
        }

        return formatCurrency(
            Number(invoiceSummary.total_amount || 0) + lateFeeAmount.value,
        );
    });
    const receivedDisplay = computed(() => {
        const received = state.amount_received != null && state.amount_received !== ''
            ? Number(state.amount_received)
            : Number(state.amount);

        if (!Number.isFinite(received) || (state.amount == null && state.amount_received == null)) {
            return '—';
        }

        return formatCurrency(received);
    });
    const refundDisplay = computed(() => {
        if (state.refund_amount != null && state.refund_amount !== '') {
            return formatCurrency(Number(state.refund_amount));
        }

        const received = state.amount_received != null ? Number(state.amount_received) : null;
        const due = state.amount != null ? Number(state.amount) : null;

        if (received == null || due == null || !Number.isFinite(received) || !Number.isFinite(due)) {
            return formatCurrency(0);
        }

        return formatCurrency(Math.max(roundMoney(received - due), 0));
    });
    const showChange = computed(() => {
        if (state.refund_amount != null && state.refund_amount !== '') {
            return Number(state.refund_amount) > 0;
        }

        const received = state.amount_received != null ? Number(state.amount_received) : null;
        const due = state.amount != null ? Number(state.amount) : null;

        if (received == null || due == null || !Number.isFinite(received) || !Number.isFinite(due)) {
            return false;
        }

        return roundMoney(received - due) > 0;
    });
    const balanceDisplay = computed(() => formatCurrency(displayRemainingBalance.value));

    const adminRemarkDisplay = computed(() => {
        const rejection = String(state.rejection_reason || '').trim();

        if (rejection) {
            return rejection;
        }

        const note = String(state.note || '').trim();

        return note || '—';
    });

    const pageTitle = computed(() => (
        isApprovalView.value ? 'Payment Approval Details' : 'Payment Details'
    ));
    const pageSubtitle = computed(() => (
        isApprovalView.value
            ? 'Review submitted payment information and verify the payment'
            : 'View payment information and related invoice summary'
    ));

    return {
        isApprovalView,
        backRoute,
        isLoading,
        state,
        invoiceSummary,
        proofPreview,
        showProofPreview,
        showApproveDialog,
        showRejectDialog,
        adminRemark,
        workflowLoading,
        paymentId,
        paymentStatus,
        formattedCreatedAt,
        formattedPaymentDate,
        formattedVerifiedDate,
        invoiceRows,
        showLateFee,
        subTotalDisplay,
        lateFeeDisplay,
        totalDisplay,
        receivedDisplay,
        refundDisplay,
        showChange,
        balanceDisplay,
        adminRemarkDisplay,
        pageTitle,
        pageSubtitle,
        canReviewPayment,
        invoiceRoute: computed(() => (
            state.invoice_id ? { name: 'showInvoice', params: { id: state.invoice_id } } : null
        )),
        formatCurrency,
        handleReject,
        confirmReject,
        runWorkflow,
        canShowApprove,
        canApprove,
        canReject,
    };
}
