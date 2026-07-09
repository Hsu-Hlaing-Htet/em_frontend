import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { resolveMediaUrl } from '@/utils/media';
import { useReceiptStore } from '../store';

export default function useShowReceipt() {
    const store = useReceiptStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isIssuing = ref(false);

    const state = reactive({
        id: null,
        payment_id: null,
        receipt_number: '',
        receipt_pdf_path: '',
        status: '',
        issued_at: '',
    });

    const pdfUrl = computed(() => resolveMediaUrl(state.receipt_pdf_path));

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
        pdfUrl,
        handleIssue,
        canIssue,
    };
}
