import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import {
    LATE_FEE_TYPE_OPTIONS,
    LATE_FEE_PER_OPTIONS,
    LATE_FEE_STATUS_OPTIONS,
} from '@/constants/constant';
import { useLateFeeStore } from '../store';

export default function useEditLateFee() {
    const store = useLateFeeStore();
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
        type: 'fixed',
        value: 0,
        per: 'day',
        grace_days: 0,
        status: 'active',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchLateFee();
        }
    });

    onMounted(() => {
        fetchLateFee();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchLateFee = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    type: response.data.type || 'fixed',
                    value: Number(response.data.value),
                    per: response.data.per || 'day',
                    grace_days: Number(response.data.grace_days),
                    status: response.data.status || 'active',
                });
            }
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.update({ ...state });
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'lateFeeList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        submitted,
        errors,
        state,
        typeOptions: LATE_FEE_TYPE_OPTIONS,
        perOptions: LATE_FEE_PER_OPTIONS,
        statusOptions: LATE_FEE_STATUS_OPTIONS,
    };
}
