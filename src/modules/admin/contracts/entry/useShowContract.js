import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useContractStore } from '../store';

export default function useShowContract() {
    const store = useContractStore();
    const route = useRoute();
    const isLoading = ref(true);
    const workflowLoading = ref({ submit: false, approve: false, reject: false });

    const state = reactive({
        id: null,
        contract_number: '',
        user_id: null,
        user_name: '',
        room_id: null,
        room_number: '',
        payment_plan_id: null,
        payment_plan_name: '',
        contract_total: '',
        type: '',
        payment_type: '',
        duration_months: null,
        start_date: '',
        end_date: '',
        billing_day: null,
        status: '',
        remark: '',
        approved_at: '',
        created_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchContract();
        }
    });

    onMounted(() => {
        fetchContract();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchContract = async () => {
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

    const canSubmit = () => state.status === 'draft';
    const canApprove = () => state.status === 'pending';
    const canReject = () => ['draft', 'pending'].includes(state.status);

    return {
        isLoading,
        state,
        workflowLoading,
        runWorkflow,
        canSubmit,
        canApprove,
        canReject,
    };
}
