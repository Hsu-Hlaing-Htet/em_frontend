import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    PAYMENT_PLAN_STATUS_OPTIONS,
    PAYMENT_PLAN_TYPE_OPTIONS,
} from '@/constants/constant';
import { usePaymentPlanStore } from '../store';

export default function useNewPaymentPlan() {
    const store = usePaymentPlanStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        name: '',
        payment_type: 'full',
        duration_months: null,
        interest_percentage: 0,
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
            { field: 'payment_type', type: 'select' },
            { field: 'interest_percentage', type: 'number', min: 0 },
            { field: 'status', type: 'select' },
            {
                field: 'duration_months',
                type: 'select',
                when: (values) => values.payment_type === 'installment',
            },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'paymentPlanList' });
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
                showApiErrorToast(error, 'Unable to save payment plan.');
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
        paymentTypeOptions: PAYMENT_PLAN_TYPE_OPTIONS,
        statusOptions: PAYMENT_PLAN_STATUS_OPTIONS,
    };
}
