import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { useReceiptStore } from '../store';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function useReceiptDocumentPage() {
    const route = useRoute();
    const store = useReceiptStore();
    const isLoading = ref(true);

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
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const {
        downloadPdf,
        exportPdf,
        printPdf,
        sendEmail,
    } = useReceiptDocumentActions(state, () => document.value, service);

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
        sendEmail,
        canSendEmail: computed(() => (
            state.approval_status === 'approved' && state.status === 'issued'
        )),
    };
}
