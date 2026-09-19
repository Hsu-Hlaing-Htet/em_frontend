import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { UTILITY_TYPE_STATUS_OPTIONS } from '@/constants/constant';
import { useMaintenanceCategoryStore } from '../store';

export default function useNewMaintenanceCategory() {
    const store = useMaintenanceCategoryStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        name: '',
        status: 'active',
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
            { field: 'status', type: 'select' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'maintenanceCategoryList' });
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
                showApiErrorToast(error, 'Unable to save maintenance category.');
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
        statusOptions: UTILITY_TYPE_STATUS_OPTIONS,
    };
}
