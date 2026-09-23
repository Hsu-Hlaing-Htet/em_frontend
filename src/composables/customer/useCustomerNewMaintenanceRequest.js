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
    const isDragging = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const categoryOptions = ref([]);
    const photoFile = ref(null);
    const photoPreviewUrl = ref('');
    const fileInputEl = ref(null);

    const state = reactive({
        room_id: null,
        title: '',
        category: null,
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
                value: category.slug,
            }));

            if (roomOptions.value.length === 1) {
                state.room_id = roomOptions.value[0].value;
            }
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

    const clearPhoto = () => {
        if (photoPreviewUrl.value) {
            URL.revokeObjectURL(photoPreviewUrl.value);
        }

        photoFile.value = null;
        photoPreviewUrl.value = '';
        isDragging.value = false;
        errors.clear('photo');

        if (fileInputEl.value) {
            fileInputEl.value.value = '';
        }
    };

    const assignPhoto = (file) => {
        clearPhoto();

        if (!file) {
            return;
        }

        if (!String(file.type || '').startsWith('image/')) {
            errors.record({ photo: ['Please choose an image file.'] });
            return;
        }

        errors.clear('photo');
        photoFile.value = file;
        photoPreviewUrl.value = URL.createObjectURL(file);
    };

    const openFilePicker = () => {
        if (isSaving.value) {
            return;
        }

        fileInputEl.value?.click();
    };

    const onPhotoInputChange = (event) => {
        const file = event.target?.files?.[0] || null;
        assignPhoto(file);
    };

    const onPhotoDrop = (event) => {
        isDragging.value = false;
        const file = event.dataTransfer?.files?.[0] || null;
        assignPhoto(file);
    };

    const goBack = () => {
        router.push({ name: 'customerMaintenanceRequestList' });
    };

    const handleSubmit = async () => {
        if (isSaving.value) {
            return;
        }

        errors.clear();

        if (!categoryOptions.value.length) {
            errors.record({ category: ['No maintenance categories available'] });
            return;
        }

        if (!applyValidation(errors, state, [
            { field: 'title', type: 'text' },
            { field: 'category', type: 'select' },
            { field: 'room_id', type: 'select' },
            { field: 'priority', type: 'select' },
            { field: 'description', type: 'text' },
        ])) {
            return;
        }

        isSaving.value = true;

        try {
            // Photo remains UI-only until backend supports attachments on maintenance_requests.
            await store.create({
                ...state,
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
                errors.record(error.data?.data || error.data?.errors || {});
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
        isDragging,
        errors,
        state,
        roomOptions,
        photoPreviewUrl,
        fileInputEl,
        categoryOptions,
        priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        openFilePicker,
        onPhotoInputChange,
        onPhotoDrop,
        clearPhoto,
        goBack,
        handleSubmit,
    };
}
