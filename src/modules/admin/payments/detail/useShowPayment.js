import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { formatPropertyUnit, formatPaymentMethodTypeLabel, formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import {
    buildPaymentCustomerInfo,
    buildPaymentSummaryNote,
} from '@/helpers/documents/renderPaymentDocument';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { usePaymentStore } from '../store';

export default function useShowPayment() {
    const store = usePaymentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isUploading = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
    const proofPreview = ref('');
    const showProofPreview = ref(false);
    const showRejectDialog = ref(false);
    const paidAmountInput = ref(null);
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
        customer_nrc: '',
        property_unit: '',
        display_status: '',
        reference_number: '',
        created_at: '',
        receipt_id: null,
        receipt_number: '',
        receipt_status: '',
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

    const fetchPayment = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                proofPreview.value = response.data.proof_image_url || '';
                paidAmountInput.value = response.data.amount == null
                    ? null
                    : Number(response.data.amount);
            }
        } finally {
            isLoading.value = false;
        }
    };

    const canEditPaidAmount = computed(() => (
        isApprovalView.value && state.status === 'pending'
    ));

    const remainingAfterPaidAmount = computed(() => {
        const currentBalance = Number(state.balance || 0);
        const paid = Number(paidAmountInput.value || 0);

        return Math.max(roundMoney(currentBalance - paid), 0);
    });

    const displayRemainingBalance = computed(() => {
        if (canEditPaidAmount.value) {
            return remainingAfterPaidAmount.value;
        }

        return Number(state.balance || 0);
    });

    const formattedEnteredPaidAmount = computed(() => {
        if (state.amount == null || state.amount === '') {
            return '—';
        }

        return formatCurrency(state.amount);
    });

    const paidAmountError = computed(() => {
        if (!canEditPaidAmount.value) {
            return '';
        }

        if (paidAmountInput.value == null || paidAmountInput.value === '') {
            return 'Paid Amount is required.';
        }

        const paid = Number(paidAmountInput.value);
        const balance = Number(state.balance || 0);

        if (!Number.isFinite(paid) || paid <= 0) {
            return 'Paid Amount must be greater than zero.';
        }

        if (roundMoney(paid) > roundMoney(balance)) {
            return 'Paid Amount cannot exceed the current balance.';
        }

        return '';
    });

    const isPaidAmountValid = computed(() => !paidAmountError.value
        && paidAmountInput.value != null
        && Number(paidAmountInput.value) > 0);

    const onProofSelect = async (event) => {
        const file = event.files?.[0];
        if (!file) {
            return;
        }

        isUploading.value = true;

        try {
            await store.uploadProof({ id: state.id, file });
            const response = store.getActionResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                proofPreview.value = response.data.proof_image_url || '';
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } finally {
            isUploading.value = false;
        }
    };

    const openRejectDialog = () => {
        showRejectDialog.value = true;
    };

    const confirmReject = async (reason) => {
        await runWorkflow('reject', { rejection_reason: reason });
    };

    const runWorkflow = async (action, payload = {}) => {
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
                    amount: Number(paidAmountInput.value),
                });
            } else {
                await store.reject({
                    id: state.id,
                    ...payload,
                });
            }

            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data || {});
                EventBus.emit('show-toast', {
                    severity: action === 'reject' ? 'warn' : 'success',
                    summary: '',
                    detail: response.message,
                });

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

    const canShowApprove = () => canEditPaidAmount.value;
    const canApprove = () => canEditPaidAmount.value && isPaidAmountValid.value;
    const canReject = () => canEditPaidAmount.value;

    const receiptRoute = computed(() => (
        state.receipt_id ? { name: 'showReceipt', params: { id: state.receipt_id } } : null
    ));

    const propertyUnit = computed(() => formatPropertyUnit(state));
    const paymentStatus = computed(() => state.display_status || state.status);
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(state.created_at));
    const customerLines = computed(() => buildPaymentCustomerInfo(state).lines);
    const paymentSummaryNote = computed(() => buildPaymentSummaryNote(state));
    const paymentTableRows = computed(() => [{
        invoice_number: state.invoice_number || '—',
        invoice_amount: formatCurrency(state.invoice_amount),
        paid_amount: formatCurrency(state.paid_amount),
        balance: formatCurrency(state.balance),
        entered_paid_amount: null,
        remaining_balance: null,
        payment_type: formatPaymentTypeLabel(state.payment_type),
        payment_method_type: formatPaymentMethodTypeLabel(state.payment_method_type),
        payment_date: formatDate(state.payment_date) || '—',
        payment_method_name: state.payment_method_name || '—',
    }]);

    return {
        isApprovalView,
        backRoute,
        receiptRoute,
        isLoading,
        isUploading,
        state,
        proofPreview,
        showProofPreview,
        showRejectDialog,
        paidAmountInput,
        paidAmountError,
        canEditPaidAmount,
        remainingAfterPaidAmount,
        displayRemainingBalance,
        formattedEnteredPaidAmount,
        workflowLoading,
        propertyUnit,
        paymentStatus,
        formattedCreatedAt,
        customerLines,
        paymentSummaryNote,
        paymentTableRows,
        invoiceRoute: computed(() => (
            state.invoice_id ? { name: 'showInvoice', params: { id: state.invoice_id } } : null
        )),
        formatCurrency,
        onProofSelect,
        openRejectDialog,
        confirmReject,
        runWorkflow,
        canShowApprove,
        canApprove,
        canReject,
    };
}

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
