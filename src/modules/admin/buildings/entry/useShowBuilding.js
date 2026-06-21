import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBuildingStore } from '../store';

export default function useShowBuilding() {
    const store = useBuildingStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        building_name: '',
        location: '',
        description: '',
        created_at: '',
        updated_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchBuilding();
        }
    });

    onMounted(() => {
        fetchBuilding();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchBuilding = async () => {
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
