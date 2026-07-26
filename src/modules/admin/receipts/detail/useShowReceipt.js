import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useReceiptStore } from '../store';

export default function useShowReceipt() {
    const store = useReceiptStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isIssuing = ref(false);
    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'receiptApprovalList' }
            : { name: 'receiptList' }
    ));

    const state = reactive({
        id: null,
        payment_id: null,
        payment_number: '',
        receipt_number: '',
        receipt_pdf_path: '',
        status: '',
        issued_at: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        payment_amount: '',
        payment_method_name: '',
        payment_date: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        created_at: '',
    });

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

                if (isApprovalView.value) {
                    await router.push({ name: 'receiptList' });
                }
            }
        } finally {
            isIssuing.value = false;
        }
    };

    const canIssue = () => state.status === 'draft';
    const documentRoute = computed(() => (
        state.id ? { name: 'receiptDocument', params: { id: state.id } } : null
    ));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        isLoading,
        isIssuing,
        state,
        handleIssue,
        canIssue,
    };
}
