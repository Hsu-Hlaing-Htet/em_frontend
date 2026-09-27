import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { buildDocumentEmailRecipients } from '@/helpers/documents/buildDocumentEmailRecipients';
import { useReceiptStore } from '../store';
import { service } from '../service';

export default function useShowReceipt() {
    const store = useReceiptStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isSendingEmail = ref(false);
    const backRoute = computed(() => ({ name: 'receiptList' }));

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
        primary_customer_name: '',
        second_customer_name: '',
        second_customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        invoice_amount: 0,
        invoice_base_amount: 0,
        late_fee: 0,
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
    const showSendEmailDialog = ref(false);

    const emailRecipients = computed(() => buildDocumentEmailRecipients(state));

    const fetchReceipt = async ({ quiet = false } = {}) => {
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
            showApiErrorToast(error, 'Unable to load receipt.');
        } finally {
            if (!quiet) {
                isLoading.value = false;
            }
        }
    };

    const openSendEmailDialog = async () => {
        await fetchReceipt({ quiet: true });
        showSendEmailDialog.value = true;
    };

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

    const canSendEmail = () => state.approval_status === 'approved';
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(
        state.sent_at || state.issued_at || state.created_at,
    ));
    const documentRoute = computed(() => (
        state.id ? { name: 'receiptDocument', params: { id: state.id } } : null
    ));

    return {
        backRoute,
        documentRoute,
        isLoading,
        isSendingEmail,
        showSendEmailDialog,
        emailRecipients,
        state,
        formattedCreatedAt,
        openSendEmailDialog,
        confirmSendEmail,
        canSendEmail,
        downloadPdf,
    };
}
