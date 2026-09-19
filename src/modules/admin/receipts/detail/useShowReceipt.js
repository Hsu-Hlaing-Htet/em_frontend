import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { useReceiptStore } from '../store';
import { service } from '../service';

export default function useShowReceipt() {
    const store = useReceiptStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSendingEmail = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
    const showApproveDialog = ref(false);
    const showRejectDialog = ref(false);
    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'receiptApprovalList' }
            : { name: 'receiptList' }
    ));

    const state = reactive({
        id: null,
        payment_id: null,
        receipt_number: '',
        receipt_pdf_path: '',
        status: '',
        approval_status: '',
        display_status: '',
        issued_at: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        invoice_amount: 0,
        paid_amount: 0,
        balance: 0,
        payment_type: '',
        payment_amount: '',
        payment_method_name: '',
        payment_method_type: '',
        payment_date: '',
        building_name: '',
        room_number: '',
        items: [],
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        sent_at: '',
        sent_by_name: '',
        can_send_email: false,
        is_sent: false,
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const { downloadPdf } = useReceiptDocumentActions(state, () => document.value, service);

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchReceipt();
        }
    });

    onMounted(() => {
        fetchReceipt();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchReceipt = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
            }
        } finally {
            isLoading.value = false;
        }
    };

    const runWorkflow = async (action, payload = {}) => {
        const canRun = action === 'approve' ? canApprove() : canReject();

        if (!canRun || workflowLoading.value.approve || workflowLoading.value.reject) {
            return;
        }

        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id, ...payload });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
                showApproveDialog.value = false;
                showRejectDialog.value = false;

                if (isApprovalView.value && action === 'approve') {
                    await router.push({ name: 'showReceipt', params: { id: state.id } });
                } else if (isApprovalView.value) {
                    await router.push({ name: 'receiptApprovalList' });
                }
            }
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const handleSendEmail = async () => {
        isSendingEmail.value = true;

        try {
            const response = await service.sendDocumentEmail({
                id: state.id,
                email: state.customer_email || undefined,
            });

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || 'Receipt sent to customer successfully.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to send receipt email. You can retry when mail delivery is available.');
        } finally {
            isSendingEmail.value = false;
        }
    };

    const canApprove = () => isApprovalView.value && state.approval_status === 'pending';
    const canReject = () => isApprovalView.value && state.approval_status === 'pending';
    const canSendEmail = () => state.can_send_email
        || (state.approval_status === 'approved' && !state.is_sent && !state.sent_at);
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(
        state.sent_at || state.issued_at || state.created_at,
    ));
    const documentRoute = computed(() => (
        state.id ? { name: 'receiptDocument', params: { id: state.id } } : null
    ));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        isLoading,
        isSendingEmail,
        workflowLoading,
        showApproveDialog,
        showRejectDialog,
        state,
        formattedCreatedAt,
        handleSendEmail,
        runWorkflow,
        canApprove,
        canReject,
        canSendEmail,
        downloadPdf,
    };
}
