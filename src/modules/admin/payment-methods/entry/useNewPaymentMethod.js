import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { UTILITY_TYPE_STATUS_OPTIONS } from '@/constants/constant';
import { usePaymentMethodStore } from '../store';

export default function useNewPaymentMethod() {
    const store = usePaymentMethodStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        name: '',
        status: 'active',
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'paymentMethodList' });
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
                showApiErrorToast(error, 'Unable to save payment method.');
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
