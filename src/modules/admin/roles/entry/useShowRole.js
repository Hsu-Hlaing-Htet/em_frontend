import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStore } from '../store';

export default function useShowRole() {
    const store = useRoleStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        name: '',
        created_at: '',
        updated_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRole();
        }
    });

    onMounted(() => {
        fetchRole();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchRole = async () => {
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
