import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useProfileStore } from '../store';
import { useUserStore } from '@/modules/admin/users/store';

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

export default function useNewProfile() {
    const store = useProfileStore();
    const userStore = useUserStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const userOptions = ref([]);

    const state = reactive({
        user_id: null,
        phone: '',
        nrc: '',
        dob: null,
        gender: null,
        address: '',
        avatar_path: '',
    });

    onMounted(async () => {
        await userStore.fetchAll({ per_page: 100 });

        if (userStore.getAllResponse?.data?.data) {
            userOptions.value = userStore.getAllResponse.data.data.map((user) => ({
                label: `${user.name} (${user.email})`,
                value: user.id,
            }));
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const formatDate = (value) => {
        if (!value) {
            return null;
        }

        if (typeof value === 'string') {
            return value;
        }

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.add({
                ...state,
                dob: formatDate(state.dob),
            });

            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'profileList' });
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
        errors,
        state,
        userOptions,
        genderOptions,
    };
}
