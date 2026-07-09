import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { resolveMediaUrl } from '@/utils/media';
import { usePaymentStore } from '../store';

export default function useShowPayment() {
    const store = usePaymentStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isUploading = ref(false);
    const workflowLoading = ref({ approve: false, reject: false });
    const proofPreview = ref('');

    const state = reactive({
        id: null,
        invoice_id: null,
        payment_method_id: null,
        payment_method_name: '',
        amount: '',
        proof_image_path: '',
        proof_image_url: '',
        note: '',
        payment_date: '',
        status: '',
        approved_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchPayment();
        }
    });

    onMounted(() => {
        fetchPayment();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchPayment = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                proofPreview.value = response.data.proof_image_url || '';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const onProofSelect = async (event) => {
        const file = event.files?.[0];
        if (!file) {
            return;
        }

        isUploading.value = true;

        try {
            await store.uploadProof({ id: state.id, file });
            const response = store.getActionResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                proofPreview.value = response.data.proof_image_url || resolveMediaUrl(response.data.proof_image_path);
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } finally {
            isUploading.value = false;
        }
    };

    const runWorkflow = async (action) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id });
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
            workflowLoading.value[action] = false;
        }
    };

    const canApprove = () => state.status === 'pending';
    const canReject = () => state.status === 'pending';

    return {
        isLoading,
        isUploading,
        state,
        proofPreview,
        workflowLoading,
        onProofSelect,
        runWorkflow,
        canApprove,
        canReject,
    };
}
