import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { MOCK_DRAFT_CONTRACTS } from '../../mockData';
import useSaleDraftForm from './useSaleDraftForm';

export default function useEditSaleDraft() {
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const form = useSaleDraftForm();

    const fetchDraft = async () => {
        isLoading.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        const draft = MOCK_DRAFT_CONTRACTS.find((item) => item.id === Number(route.params.id));
        form.loadState(draft);
        isLoading.value = false;
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchDraft();
        }
    });

    onMounted(fetchDraft);

    const handleSubmit = async () => {
        isLoading.value = true;
        form.submitted.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 300);
        });

        EventBus.emit('show-toast', {
            severity: 'success',
            summary: '',
            detail: 'Sale contract draft updated successfully.',
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
