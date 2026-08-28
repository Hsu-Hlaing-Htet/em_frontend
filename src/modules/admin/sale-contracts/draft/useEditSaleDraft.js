import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleContractDraftStore } from '../store';
import { formatDate } from '@/utils/formatter';
import { mapSaleDraftToApi } from './mapSaleDraft';
import useSaleDraftForm from './useSaleDraftForm';

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

export default function useEditSaleDraft() {
    const router = useRouter();
    const route = useRoute();
    const store = useSaleContractDraftStore();
    const isLoading = ref(true);
    const errors = new Errors();
    const form = useSaleDraftForm();

    bindErrorClearing(form.state, errors);

    watch(() => form.state.customer_id, () => {
        if (errors.has('user_id')) {
            errors.clear('user_id');
        }
    });

    const fetchDraft = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                await form.loadState(response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load sale contract draft.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchDraft();
        }
    });

    onMounted(fetchDraft);

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
            const payload = {
                id: form.state.id,
                ...mapSaleDraftToApi(form.state),
            };

            if (form.state.start_date) {
                payload.start_date = formatDate(form.state.start_date);
            }

            await store.update(payload);
            const response = store.getUpdateResponse;

            if (response) {
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });

                await router.push({ name: 'saleContractDraftList' });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to update sale contract draft.');
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
