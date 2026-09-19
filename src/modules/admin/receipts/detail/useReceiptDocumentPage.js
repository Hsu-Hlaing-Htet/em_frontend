import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useReceiptStore } from '../store';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function useReceiptDocumentPage() {
    const route = useRoute();
    const router = useRouter();
    const store = useReceiptStore();
    const isLoading = ref(true);
    const isSendingEmail = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
    const showApproveDialog = ref(false);
    const showRejectDialog = ref(false);
    const isApprovalView = computed(() => route.meta.approvalContext === true);

    const state = reactive({
        id: null,
        receipt_number: '',
        payment_id: null,
        status: '',
        approval_status: '',
        display_status: '',
        issued_at: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        billing_month: '',
        invoice_base_amount: 0,
        late_fee: 0,
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
        can_send_email: false,
        is_sent: false,
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const {
        downloadPdf,
        exportPdf,
        printPdf,
        viewPdf,
    } = useReceiptDocumentActions(state, () => document.value, service);

    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'receiptApprovalList' }
            : { name: 'receiptList' }
    ));

    const canApprove = () => isApprovalView.value && state.approval_status === 'pending';
    const canReject = () => isApprovalView.value && state.approval_status === 'pending';
    const canSendEmail = computed(() => !isApprovalView.value && (
        state.can_send_email
        || (state.approval_status === 'approved' && !state.is_sent && !state.sent_at)
    ));

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

    const runWorkflow = async (action, payload = {}) => {
        const canRun = action === 'approve' ? canApprove() : canReject();

        if (!canRun || workflowLoading.value.approve || workflowLoading.value.reject) {
            return;
        }

        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id, ...payload });
            const response = store.getActionResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || state.items;
            }

            EventBus.emit('show-toast', {
                severity: action === 'reject' ? 'warn' : 'success',
                summary: '',
                detail: response?.message || `Receipt ${action}d successfully.`,
            });

            showApproveDialog.value = false;
            showRejectDialog.value = false;

            if (isApprovalView.value) {
                await router.push({ name: 'receiptApprovalList' });

                return;
            }

        } catch (error) {
            showApiErrorToast(error, `Unable to ${action} receipt.`);
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const loadReceipt = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load receipt document.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadReceipt();
        }
    });

    onMounted(loadReceipt);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        document,
        backRoute,
        isApprovalView,
        downloadPdf,
        exportPdf,
        printPdf,
        viewPdf,
        printContract: printPdf,
        handleSendEmail,
        isSendingEmail,
        canSendEmail,
        workflowLoading,
        showApproveDialog,
        showRejectDialog,
        canApprove,
        canReject,
        runWorkflow,
    };
}
