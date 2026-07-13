import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import useSaleDraftForm from './useSaleDraftForm';

export default function useNewSaleDraft() {
    const router = useRouter();
    const isLoading = ref(false);
    const form = useSaleDraftForm();

    const handleSubmit = async () => {
        isLoading.value = true;
        form.submitted.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 300);
        });

        EventBus.emit('show-toast', {
            severity: 'success',
            summary: '',
            detail: 'Sale contract draft saved successfully.',
        });

        await router.push({ name: 'saleContractDraftList' });
        isLoading.value = false;
    };

    return {
        isLoading,
        handleSubmit,
        ...form,
    };
}
