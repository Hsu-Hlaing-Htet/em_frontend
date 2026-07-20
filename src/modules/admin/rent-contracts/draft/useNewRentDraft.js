import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentContractDraftStore } from '../store';
import { mapRentDraftToApi } from './mapRentDraft';
import useRentDraftForm from './useRentDraftForm';

export default function useNewRentDraft() {
    const router = useRouter();
    const store = useRentContractDraftStore();
    const isLoading = ref(false);
    const errors = new Errors();
    const form = useRentDraftForm();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        form.submitted.value = true;
        errors.clear();

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
