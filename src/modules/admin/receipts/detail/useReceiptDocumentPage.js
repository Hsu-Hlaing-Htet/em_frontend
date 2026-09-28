import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useReceiptStore } from '../store';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { buildDocumentEmailRecipients } from '@/helpers/documents/buildDocumentEmailRecipients';
import { service } from '../service';

export default function useReceiptDocumentPage() {
    const route = useRoute();
    const store = useReceiptStore();
    const isLoading = ref(true);
    const isSendingEmail = ref(false);
    const showSendEmailDialog = ref(false);

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
        primary_customer_name: '',
        second_customer_name: '',
        second_customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        billing_month: '',
        invoice_base_amount: 0,
        late_fee: 0,
        late_fee_notes: null,
        invoice_amount: 0,
        paid_amount: 0,
        amount_received: null,
        refund_amount: null,
        financial_summary: null,
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
        paid_by: '',
        approved_by_name: '',
        payment_approved_by_name: '',
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

    const backRoute = computed(() => ({ name: 'receiptList' }));
    const emailRecipients = computed(() => buildDocumentEmailRecipients(state));

    const canSendEmail = computed(() => state.approval_status === 'approved');

    const openSendEmailDialog = async () => {
        // Refresh so confirmation shows CURRENT users.email (not a stale page snapshot).
        await loadReceipt({ quiet: true });
        showSendEmailDialog.value = true;
    };

    const confirmSendEmail = async () => {
        if (isSendingEmail.value) {
            return;
        }

        isSendingEmail.value = true;

        try {
            const response = await service.sendDocumentEmail({
                id: state.id,
            });

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
            }

            showSendEmailDialog.value = false;

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

    const loadReceipt = async ({ quiet = false } = {}) => {
        if (!quiet) {
            isLoading.value = true;
        }

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
            if (!quiet) {
                isLoading.value = false;
            }
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
        downloadPdf,
        exportPdf,
        printPdf,
        viewPdf,
        printContract: printPdf,
        openSendEmailDialog,
        confirmSendEmail,
        isSendingEmail,
        showSendEmailDialog,
        emailRecipients,
        canSendEmail,
        state,
    };
}
