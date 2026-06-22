import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { UTILITY_TYPE_STATUS_OPTIONS } from '../constants';
import { useUtilityTypeStore } from '../store';

export default function useEditUtilityType() {
    const store = useUtilityTypeStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
        slug: '',
        status: 'active',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchUtilityType();
        }
    });

    onMounted(() => {
        fetchUtilityType();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchUtilityType = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    slug: response.data.slug || '',
                    status: response.data.status || 'active',
                });
            }
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this utility type?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteUtilityType(id),
        });
    };

    const deleteUtilityType = async (id) => {
        isLoading.value = true;
        await store.delete({ id });
        const response = store.getDeleteResponse;

        if (response) {
            await router.push({ name: 'utilityTypeList' });
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
            const payload = { ...state };

            if (!payload.slug) {
                delete payload.slug;
            }

            await store.update(payload);
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'utilityTypeList' });
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
        statusOptions: UTILITY_TYPE_STATUS_OPTIONS,
    };
}
