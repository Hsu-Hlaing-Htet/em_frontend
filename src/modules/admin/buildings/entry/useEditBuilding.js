import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useBuildingStore } from '../store';
import { showApiErrorToast } from '@/utils/apiError';

export default function useEditBuilding() {
    const store = useBuildingStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        building_name: '',
        location: '',
        description: '',
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
                Object.assign(state, {
                    id: response.data.id,
                    building_name: response.data.building_name || '',
                    location: response.data.location || '',
                    description: response.data.description || '',
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load building.');
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this building?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteBuilding(id),
        });
    };

    const deleteBuilding = async (id) => {
        isLoading.value = true;

        try {
            await store.delete({ id });
            const response = store.getDeleteResponse;

            if (response) {
                await router.push({ name: 'buildingList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to delete this building.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.update({ ...state });
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'buildingList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to save building.');
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
