import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentContractDraftStore } from '../store';
import { formatDate } from '@/utils/formatter';
import { mapRentDraftToApi } from './mapRentDraft';
import useRentDraftForm from './useRentDraftForm';

export default function useEditRentDraft() {
    const router = useRouter();
    const route = useRoute();
    const store = useRentContractDraftStore();
    const isLoading = ref(true);
    const errors = new Errors();
    const form = useRentDraftForm();

    const fetchDraft = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                await form.loadState(response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load rent contract draft.');
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
                ...mapRentDraftToApi(form.state),
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

                await router.push({ name: 'rentContractDraftList' });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to update rent contract draft.');
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
