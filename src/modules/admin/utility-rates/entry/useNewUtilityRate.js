import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { formatDate } from '@/utils/formatter';
import { UTILITY_RATE_STATUS_OPTIONS } from '@/constants/constant';
import { useUtilityRateStore } from '../store';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';

export default function useNewUtilityRate() {
    const store = useUtilityRateStore();
    const utilityTypeStore = useUtilityTypeStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);
    const utilityTypeOptions = ref([]);

    const state = reactive({
        utility_type_id: null,
        unit_price: 0,
        effective_date: null,
        status: 'active',
    });

    onMounted(async () => {
        await utilityTypeStore.fetchAll({ per_page: 100 });
        const response = utilityTypeStore.getAllResponse;

        if (response?.data?.data) {
            utilityTypeOptions.value = response.data.data.map((utilityType) => ({
                label: utilityType.name,
                value: utilityType.id,
            }));
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
        utilityTypeStore.$reset();
        utilityTypeStore.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            const payload = {
                ...state,
                effective_date: formatDate(state.effective_date),
            };

            await store.add(payload);
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'utilityRateList' });
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
        statusOptions: UTILITY_RATE_STATUS_OPTIONS,
        utilityTypeOptions,
    };
}
