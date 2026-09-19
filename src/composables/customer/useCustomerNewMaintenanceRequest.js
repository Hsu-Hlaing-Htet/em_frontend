import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { MAINTENANCE_PRIORITY_OPTIONS } from '@/constants/constant';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';

export default function useCustomerNewMaintenanceRequest() {
    const store = useCustomerMaintenanceRequestStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const categoryOptions = ref([]);
    const photoFile = ref(null);
    const photoPreviewUrl = ref('');

    const state = reactive({
        room_id: null,
        title: '',
        maintenance_category_id: null,
        priority: null,
        description: '',
    });

    bindErrorClearing(state, errors);

    onMounted(async () => {
        isLoading.value = true;

        try {
            await Promise.all([
                store.fetchRooms(),
                store.fetchCategories(),
            ]);
            const rooms = store.getRoomsResponse?.data || [];
            roomOptions.value = rooms.map((room) => ({
                label: room.label || `${room.building_name || ''} · ${room.room_number}`.trim(),
                value: room.id,
            }));
            const categories = store.getCategoriesResponse?.data || [];
            categoryOptions.value = categories.map((category) => ({
                label: category.name,
                value: category.id,
            }));
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance request options.');
        } finally {
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        clearPhoto();
        store.$reset();
        store.$dispose();
    });

    const onPhotoSelect = (event) => {
        const file = event.files?.[0] || null;
        clearPhoto();

        if (!file) {
            return;
        }

        photoFile.value = file;
        photoPreviewUrl.value = URL.createObjectURL(file);
    };

    const clearPhoto = () => {
        if (photoPreviewUrl.value) {
            URL.revokeObjectURL(photoPreviewUrl.value);
        }

        photoFile.value = null;
        photoPreviewUrl.value = '';
    };

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'title', type: 'text' },
            { field: 'maintenance_category_id', type: 'select' },
            { field: 'room_id', type: 'select' },
            { field: 'priority', type: 'select' },
            { field: 'description', type: 'text' },
        ])) {
            return;
        }

        isSaving.value = true;

        try {
            await store.create({
                ...state,
                photo: photoFile.value || undefined,
            });
            const response = store.getCreateResponse;

            if (response?.data?.id) {
                await router.push({
                    name: 'customerShowMaintenanceRequest',
                    params: { id: response.data.id },
                });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data?.data || {});
            } else {
                showApiErrorToast(error, 'Unable to submit maintenance request.');
            }
        } finally {
            isSaving.value = false;
        }
    };

    return {
        isLoading,
        isSaving,
        errors,
        state,
        roomOptions,
        photoPreviewUrl,
        categoryOptions,
        priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        onPhotoSelect,
        clearPhoto,
        handleSubmit,
    };
}
