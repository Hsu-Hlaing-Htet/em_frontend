import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useInvoiceStore } from '../store';
import { usePaymentStore } from '@/modules/admin/payments/store';

export default function useShowInvoice() {
    const store = useInvoiceStore();
    const paymentStore = usePaymentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isApproving = ref(false);
    const payments = ref([]);
    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'invoiceApprovalList' }
            : { name: 'invoiceList' }
    ));

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
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
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

                if (state.status !== 'draft') {
                    await loadPayments(state.id);
                }
            }
        } finally {
            isLoading.value = false;
        }
    };

    const handleApprove = async () => {
        isApproving.value = true;

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

                if (isApprovalView.value) {
                    await router.push({ name: 'invoiceList' });
                }
            }
        } finally {
            isApproving.value = false;
        }
    };

    const canApprove = () => isApprovalView.value && state.status === 'draft';
    const documentRoute = computed(() => (
        state.id ? { name: 'invoiceDocument', params: { id: state.id } } : null
    ));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        isLoading,
        isApproving,
        state,
        payments,
        handleApprove,
        canApprove,
    };
}
