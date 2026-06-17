import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useUserStore } from '../store';
import { useRoleStore } from '@/modules/admin/roles/store';

export default function useNewUser() {
    const store = useUserStore();
    const roleStore = useRoleStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const roleOptions = ref([]);

    const state = reactive({
        role_id: null,
        name: '',
        email: '',
        password: '',
    });

    onMounted(async () => {
        await roleStore.fetchAll({ per_page: 100 });
        const response = roleStore.getAllResponse;

        if (response?.data?.data) {
            roleOptions.value = response.data.data.map((role) => ({
                label: role.name,
                value: role.id,
            }));
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'userList' });
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
        roleOptions,
    };
}
