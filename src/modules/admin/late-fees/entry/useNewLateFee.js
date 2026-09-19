import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    LATE_FEE_TYPE_OPTIONS,
    LATE_FEE_PER_OPTIONS,
    LATE_FEE_STATUS_OPTIONS,
} from '@/constants/constant';
import { useLateFeeStore } from '../store';

export default function useNewLateFee() {
    const store = useLateFeeStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        name: '',
        type: 'fixed',
        value: 0,
        per: 'day',
        grace_days: 0,
        status: 'active',
        is_default: false,
    });

    bindErrorClearing(state, errors);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'name', type: 'text' },
            { field: 'type', type: 'select' },
            { field: 'value', type: 'number', min: 0 },
            { field: 'per', type: 'select' },
            { field: 'grace_days', type: 'number', min: 0 },
            { field: 'status', type: 'select' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

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
            } else {
                showApiErrorToast(error, 'Unable to save late fee.');
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
