import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleContractDraftStore } from '../store';
import { formatDate } from '@/utils/formatter';
import { mapSaleDraftToApi } from './mapSaleDraft';
import useSaleDraftForm from './useSaleDraftForm';

export default function useEditSaleDraft() {
    const router = useRouter();
    const route = useRoute();
    const store = useSaleContractDraftStore();
    const isLoading = ref(true);
    const errors = new Errors();
    const form = useSaleDraftForm();

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
        isLoading.value = true;
        form.submitted.value = true;
        errors.clear();

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
