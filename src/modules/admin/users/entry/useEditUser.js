import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useUserStore } from '../store';
import { useRoleStore } from '@/modules/admin/roles/store';

export default function useEditUser() {
    const store = useUserStore();
    const roleStore = useRoleStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const roleOptions = ref([]);

    const state = reactive({
        id: null,
        role_id: null,
        name: '',
        email: '',
        password: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchUser();
        }
    });

    onMounted(async () => {
        await roleStore.fetchAll({ per_page: 100 });

        if (roleStore.getAllResponse?.data?.data) {
            roleOptions.value = roleStore.getAllResponse.data.data.map((role) => ({
                label: role.name,
                value: role.id,
            }));
        }

        await fetchUser();
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
                state.id = response.data.id;
                state.role_id = response.data.role_id;
                state.name = response.data.name || '';
                state.email = response.data.email || '';
                state.password = '';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this user?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteUser(id),
        });
    };

    const deleteUser = async (id) => {
        isLoading.value = true;
        await store.delete({ id });
        const response = store.getDeleteResponse;

        if (response) {
            await router.push({ name: 'userList' });
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response.message,
            });
        }

        isLoading.value = false;
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            const payload = {
                id: state.id,
                role_id: state.role_id,
                name: state.name,
                email: state.email,
            };

            if (state.password) {
                payload.password = state.password;
            }

            await store.update(payload);
            const response = store.getUpdateResponse;

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
        showConfirmDialog,
        errors,
        state,
        roleOptions,
    };
}
