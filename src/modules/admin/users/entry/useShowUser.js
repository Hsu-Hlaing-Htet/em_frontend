import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store';

export default function useShowUser() {
    const store = useUserStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        role_id: null,
        role_name: '',
        name: '',
        email: '',
        created_at: '',
        updated_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchUser();
        }
    });

    onMounted(() => {
        fetchUser();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchUser = async () => {
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
