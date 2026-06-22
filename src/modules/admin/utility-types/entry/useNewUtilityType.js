import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { UTILITY_TYPE_STATUS_OPTIONS } from '../constants';
import { useUtilityTypeStore } from '../store';

export default function useNewUtilityType() {
    const store = useUtilityTypeStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        name: '',
        slug: '',
        status: 'active',
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            const payload = { ...state };

            if (!payload.slug) {
                delete payload.slug;
            }

            await store.add(payload);
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'utilityTypeList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
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
        statusOptions: UTILITY_TYPE_STATUS_OPTIONS,
    };
}
