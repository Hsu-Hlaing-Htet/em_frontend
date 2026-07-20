import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleContractDraftStore } from '../store';
import { mapSaleDraftToApi } from './mapSaleDraft';
import useSaleDraftForm from './useSaleDraftForm';

export default function useNewSaleDraft() {
    const router = useRouter();
    const store = useSaleContractDraftStore();
    const isLoading = ref(false);
    const errors = new Errors();
    const form = useSaleDraftForm();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        form.submitted.value = true;
        errors.clear();

        try {
            await store.add(mapSaleDraftToApi(form.state));
            const response = store.getAddResponse;

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
                showApiErrorToast(error, 'Unable to create sale contract draft.');
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
