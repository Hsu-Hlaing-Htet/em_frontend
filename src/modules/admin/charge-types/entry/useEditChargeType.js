import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { UTILITY_TYPE_STATUS_OPTIONS } from '@/constants/constant';
import { useChargeTypeStore } from '../store';

export default function useEditChargeType() {
    const store = useChargeTypeStore();
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
        status: 'active',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchChargeType();
        }
    });

    onMounted(() => {
        fetchChargeType();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchChargeType = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    status: response.data.status || 'active',
                });
            }
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
                await router.push({ name: 'chargeTypeList' });
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
