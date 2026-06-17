import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useRoleStore } from '../store';

export default function useEditRole() {
    const store = useRoleStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
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
                state.id = response.data.id;
                state.name = response.data.name || '';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this role?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteRole(id),
        });
    };

    const deleteRole = async (id) => {
        isLoading.value = true;
        await store.delete({ id });
        const response = store.getDeleteResponse;

        if (response) {
            await router.push({ name: 'roleList' });
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
            await store.update({
                id: state.id,
                name: state.name,
            });

            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'roleList' });
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
        submitted,
        errors,
        state,
    };
}
