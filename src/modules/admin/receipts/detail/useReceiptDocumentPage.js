import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useReceiptStore } from '../store';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function useReceiptDocumentPage() {
    const route = useRoute();
    const store = useReceiptStore();
    const isLoading = ref(true);
    const isSendingEmail = ref(false);

    const state = reactive({
        id: null,
        receipt_number: '',
        payment_id: null,
        status: '',
        approval_status: '',
        issued_at: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        invoice_amount: 0,
        paid_amount: 0,
        balance: 0,
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
    } = useReceiptDocumentActions(state, () => document.value, service);

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

    const backRoute = computed(() => (
        route.meta.approvalContext
            ? { name: 'showReceiptApproval', params: { id: state.id } }
            : { name: 'showReceipt', params: { id: state.id } }
    ));

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
        downloadPdf,
        exportPdf,
        printPdf,
        printContract: printPdf,
        handleSendEmail,
        isSendingEmail,
        canSendEmail: computed(() => state.can_send_email
            || (state.approval_status === 'approved' && !state.is_sent && !state.sent_at)),
    };
}
