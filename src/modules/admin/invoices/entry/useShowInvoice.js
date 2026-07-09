import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useInvoiceStore } from '../store';
import { usePaymentStore } from '@/modules/admin/payments/store';

export default function useShowInvoice() {
    const store = useInvoiceStore();
    const paymentStore = usePaymentStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isIssuing = ref(false);
    const payments = ref([]);

    const state = reactive({
        id: null,
        invoice_number: '',
        contract_id: null,
        utility_id: null,
        type: '',
        issued_date: '',
        due_date: '',
        late_fee: '',
        total_amount: '',
        status: '',
        items: [],
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadInvoice();
        }
    });

    onMounted(() => {
        loadInvoice();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const loadPayments = async (invoiceId) => {
        await paymentStore.fetchAll({ invoice_id: invoiceId, per_page: 100 });
        const response = paymentStore.getAllResponse;
        payments.value = response?.data?.data || [];
    };

    const loadInvoice = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
                await loadPayments(state.id);
            }
        } finally {
            isLoading.value = false;
        }
    };

    const handleIssue = async () => {
        isIssuing.value = true;

        try {
            await store.issue({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
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

    const canIssue = () => state.status === 'draft';

    return {
        isLoading,
        isIssuing,
        state,
        payments,
        handleIssue,
        canIssue,
    };
}
