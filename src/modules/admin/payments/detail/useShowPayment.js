import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { formatPropertyUnit } from '@/helpers/payments/paymentListHelpers';
import {
    buildPaymentCustomerInfo,
    buildPaymentSummaryNote,
} from '@/helpers/documents/renderPaymentDocument';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
import { usePaymentStore } from '../store';

export default function useShowPayment() {
    const store = usePaymentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isUploading = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
    const proofPreview = ref('');
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
        amount: '',
        proof_image_path: '',
        proof_image_url: '',
        note: '',
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
            }
        } finally {
            isLoading.value = false;
        }
    };

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
                proofPreview.value = response.data.proof_image_url || resolveMediaUrl(response.data.proof_image_path);
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

    const runWorkflow = async (action) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });

                if (isApprovalView.value) {
                    if (action === 'approve') {
                        if (response.data?.receipt_id) {
                            await router.push({
                                name: 'showReceipt',
                                params: { id: response.data.receipt_id },
                            });
                        } else {
                            await router.push({ name: 'receiptApprovalList' });
                        }
                    } else if (action === 'reject') {
                        await router.push({ name: 'paymentApprovalList' });
                    }
                }
            }
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const canApprove = () => state.status === 'pending';
    const canReject = () => state.status === 'pending';

    const documentRoute = computed(() => (
        state.id ? { name: 'paymentDocument', params: { id: state.id } } : null
    ));

    const receiptRoute = computed(() => (
        state.receipt_id ? { name: 'showReceipt', params: { id: state.receipt_id } } : null
    ));

    const propertyUnit = computed(() => formatPropertyUnit(state));
    const paymentStatus = computed(() => state.display_status || state.status);
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(state.created_at));
    const customerLines = computed(() => buildPaymentCustomerInfo(state).lines);
    const paymentSummaryNote = computed(() => buildPaymentSummaryNote(state));
    const paymentTableRows = computed(() => [{
        invoice_number: state.invoice_number,
        payment_date: state.payment_date,
        payment_method_name: state.payment_method_name,
        amount: formatCurrency(state.amount),
        reference_number: state.reference_number || state.invoice_number,
        status: paymentStatus.value,
    }]);

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        receiptRoute,
        isLoading,
        isUploading,
        state,
        proofPreview,
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
        runWorkflow,
        canApprove,
        canReject,
    };
}
