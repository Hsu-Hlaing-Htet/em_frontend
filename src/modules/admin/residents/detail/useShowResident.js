import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useResidentStore } from '../store';

export default function useShowResident() {
    const store = useResidentStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        name: '',
        email: '',
        phone: '',
        nrc: '',
        dob: '',
        gender: '',
        address: '',
        avatar_path: '',
        created_at: '',
        updated_at: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchResident();
        }
    });

    onMounted(() => {
        fetchResident();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchResident = async () => {
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
