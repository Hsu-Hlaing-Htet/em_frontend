import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUtilityRateStore } from '../store';

export default function useShowUtilityRate() {
    const store = useUtilityRateStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        utility_type_id: null,
        type_name: '',
        unit_price: '',
        effective_date: '',
        status: '',
        created_at: '',
        updated_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchUtilityRate();
        }
    });

    onMounted(() => {
        fetchUtilityRate();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchUtilityRate = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        state,
    };
}
