import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useMaintenanceRequestStore } from '../store';

export default function useShowMaintenanceRequest() {
    const store = useMaintenanceRequestStore();
    const route = useRoute();
    const isLoading = ref(true);
    const workflowLoading = ref({ start: false, complete: false, reject: false });

    const state = reactive({
        id: null,
        room_id: null,
        room_number: '',
        user_id: null,
        user_name: '',
        title: '',
        description: '',
        status: '',
        approved_at: '',
        created_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRequest();
        }
    });

    onMounted(() => {
        fetchRequest();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchRequest = async () => {
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

    const canStart = () => state.status === 'pending';
    const canComplete = () => state.status === 'in_progress';
    const canReject = () => ['pending', 'in_progress'].includes(state.status);

    return {
        isLoading,
        state,
        workflowLoading,
        runWorkflow,
        canStart,
        canComplete,
        canReject,
    };
}
