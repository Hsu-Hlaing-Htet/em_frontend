import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { useInvoiceStore } from '../store';
import { useInvoiceDocument } from '@/composables/admin/documents/useInvoiceDocument';
import { useInvoiceDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function useInvoiceDocumentPage() {
    const route = useRoute();
    const store = useInvoiceStore();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        invoice_number: '',
        contract_id: null,
        type: '',
        issued_date: '',
        due_date: '',
        billing_period: '',
        late_fee: '',
        total_amount: '',
        paid_amount: 0,
        remaining_balance: 0,
        notes: '',
        status: '',
        items: [],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_nrc: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
    });

    const { document } = useInvoiceDocument(state);
    const {
        downloadPdf,
        exportPdf,
        printPdf,
        sendEmail,
    } = useInvoiceDocumentActions(state, () => document.value, service);

    const backRoute = computed(() => (
        route.meta.approvalContext
            ? { name: 'showInvoiceApproval', params: { id: state.id } }
            : { name: 'showInvoice', params: { id: state.id } }
    ));

    const loadInvoice = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data, {
                    items: response.data.items || [],
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoice document.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadInvoice();
        }
    });

    onMounted(loadInvoice);

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
    };
}
