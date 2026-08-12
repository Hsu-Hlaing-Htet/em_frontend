import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    PAYMENT_PLAN_STATUS_OPTIONS,
    PAYMENT_PLAN_TYPE_OPTIONS,
} from '@/constants/constant';
import { usePaymentPlanStore } from '../store';

export default function useEditPaymentPlan() {
    const store = usePaymentPlanStore();
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
        payment_type: 'full',
        duration_months: null,
        interest_percentage: 0,
        status: 'active',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchPaymentPlan();
        }
    });

    onMounted(() => {
        fetchPaymentPlan();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchPaymentPlan = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    payment_type: response.data.payment_type || 'full',
                    duration_months: response.data.duration_months,
                    interest_percentage: response.data.interest_percentage ?? 0,
                    status: response.data.status || 'active',
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment plan.');
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
