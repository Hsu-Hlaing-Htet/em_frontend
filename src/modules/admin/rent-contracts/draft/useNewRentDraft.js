import { ref, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentContractDraftStore } from '../store';
import { mapRentDraftToApi } from './mapRentDraft';
import useRentDraftForm from './useRentDraftForm';

const DRAFT_VALIDATION_RULES = [
    { field: 'user_id', type: 'select' },
    { field: 'building_id', type: 'select' },
    { field: 'room_id', type: 'select' },
    { field: 'payment_type', type: 'select' },
    { field: 'start_date', type: 'date' },
    {
        field: 'duration_months',
        type: 'select',
        when: (values) => values.payment_type === 'installment',
    },
];

export default function useNewRentDraft() {
    const router = useRouter();
    const store = useRentContractDraftStore();
    const isLoading = ref(false);
    const errors = new Errors();
    const form = useRentDraftForm();

    bindErrorClearing(form.state, errors);

    watch(() => form.state.customer_id, () => {
        if (errors.has('user_id')) {
            errors.clear('user_id');
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        form.submitted.value = true;
        errors.clear();

        const values = {
            ...form.state,
            user_id: form.state.customer_id,
        };

        if (!applyValidation(errors, values, DRAFT_VALIDATION_RULES)) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add(mapRentDraftToApi(form.state));
            const response = store.getAddResponse;

            if (response) {
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });

                await router.push({ name: 'rentContractDraftList' });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to create rent contract draft.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        errors,
        ...form,
    };
}
