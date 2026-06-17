import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '../store';

export default function useShowProfile() {
    const store = useProfileStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        user_id: null,
        user_name: '',
        user_email: '',
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
            fetchProfile();
        }
    });

    onMounted(() => {
        fetchProfile();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchProfile = async () => {
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
