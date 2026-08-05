import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
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
    const isIssuing = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
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
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const { downloadPdf, sendEmail } = useReceiptDocumentActions(state, () => document.value, service);

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

    const runWorkflow = async (action) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });

                if (isApprovalView.value) {
                    await router.push({ name: 'receiptApprovalList' });
                }
            }
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const handleIssue = async () => {
        isIssuing.value = true;

        try {
            await store.issue({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } finally {
            isIssuing.value = false;
        }
    };

    const canApprove = () => isApprovalView.value && state.approval_status === 'pending';
    const canReject = () => isApprovalView.value && state.approval_status === 'pending';
    const canIssue = () => state.approval_status === 'approved' && state.status === 'draft';
    const canSendEmail = () => state.approval_status === 'approved' && state.status === 'issued';
    const documentRoute = computed(() => (
        state.id ? { name: 'receiptDocument', params: { id: state.id } } : null
    ));
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(state.issued_at || state.created_at));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        isLoading,
        isIssuing,
        workflowLoading,
        state,
        formattedCreatedAt,
        handleIssue,
        runWorkflow,
        canApprove,
        canReject,
        canIssue,
        canSendEmail,
        downloadPdf,
        sendEmail,
    };
}
