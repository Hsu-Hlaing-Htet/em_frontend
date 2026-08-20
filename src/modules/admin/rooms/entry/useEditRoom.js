import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing, isBlank } from '@/utils/formValidation';
import { useRoomStore } from '../store';
import { useBuildingStore } from '@/modules/admin/buildings/store';
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from '@/constants/constant';
import useRoomImages from './useRoomImages';
import useRoomDimensions from '@/composables/admin/rooms/useRoomDimensions';
import { buildRoomPayload } from '../roomForm';
import { showApiErrorToast } from '@/utils/apiError';

const ROOM_VALIDATION_RULES = [
    { field: 'building_id', type: 'select' },
    { field: 'room_number', type: 'text' },
    { field: 'floor_number', type: 'number', min: 0 },
    { field: 'area_sqft', type: 'number', min: 0 },
    { field: 'type', type: 'select' },
    { field: 'status', type: 'select' },
    { field: 'sale_price', type: 'number', min: 0 },
    { field: 'rent_price', type: 'number', min: 0 },
    { field: 'rent_deposit_price', type: 'number', min: 0 },
    { field: 'booking_deposit_price', type: 'number', min: 0 },
    {
        field: 'width_ft',
        type: 'number',
        min: 0,
        when: (values) => !isBlank(values.width_ft),
    },
    {
        field: 'length_ft',
        type: 'number',
        min: 0,
        when: (values) => !isBlank(values.length_ft),
    },
];

export default function useEditRoom() {
    const store = useRoomStore();
    const buildingStore = useBuildingStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);
    const buildingOptions = ref([]);

    const {
        stagedImages,
        persistedImages,
        addStagedFiles,
        removeStaged,
        setPrimary,
        loadPersistedFromRoom,
        persistStagedImages,
        savePersistedChanges,
        replacePersistedImage,
        deletePersistedImage,
        resetImages,
    } = useRoomImages();

    const state = reactive({
        id: null,
        building_id: null,
        room_number: '',
        floor_number: 1,
        width_ft: null,
        length_ft: null,
        area_sqft: 0,
        description: '',
        type: 'rent',
        status: 'available',
        sale_price: 0,
        rent_price: 0,
        rent_deposit_price: 0,
        booking_deposit_price: 0,
    });

    bindErrorClearing(state, errors);
    useRoomDimensions(state);

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRoom();
        }
    });

    onMounted(async () => {
        await buildingStore.fetchAll({ per_page: 100 });
        const response = buildingStore.getAllResponse;

        if (response?.data?.data) {
            buildingOptions.value = response.data.data.map((building) => ({
                label: building.building_name,
                value: building.id,
            }));
        }

        await fetchRoom();
    });

    onBeforeUnmount(() => {
        resetImages();
        store.$reset();
        store.$dispose();
    });

    const fetchRoom = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    building_id: response.data.building_id,
                    room_number: response.data.room_number || '',
                    floor_number: Number(response.data.floor_number),
                    width_ft: response.data.width_ft != null ? Number(response.data.width_ft) : null,
                    length_ft: response.data.length_ft != null ? Number(response.data.length_ft) : null,
                    area_sqft: Number(response.data.area_sqft),
                    description: response.data.description || '',
                    type: response.data.type,
                    status: response.data.status,
                    sale_price: Number(response.data.sale_price),
                    rent_price: Number(response.data.rent_price),
                    rent_deposit_price: Number(response.data.rent_deposit_price),
                    booking_deposit_price: Number(response.data.booking_deposit_price),
                });

                loadPersistedFromRoom(response.data.room_images || []);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load room.');
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this room?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteRoom(id),
        });
    };

    const confirmDeleteImage = (imageId) => {
        confirm.require({
            message: 'Are you sure you want to delete this image?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: async () => {
                isLoading.value = true;

                try {
                    await deletePersistedImage(imageId);
                    EventBus.emit('show-toast', {
                        severity: 'success',
                        summary: '',
                        detail: 'Image deleted successfully.',
                    });
                } finally {
                    isLoading.value = false;
                }
            },
        });
    };

    const deleteRoom = async (id) => {
        isLoading.value = true;

        try {
            await store.delete({ id });
            const response = store.getDeleteResponse;

            if (response) {
                await router.push({ name: 'roomList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to delete this room.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, ROOM_VALIDATION_RULES)) {
            return;
        }

        isLoading.value = true;

        try {
            await store.update(buildRoomPayload(state, { includeId: true }));
            const response = store.getUpdateResponse;

            if (!response) {
                return;
            }

            await savePersistedChanges(state.id);

            if (stagedImages.value.length) {
                const imageResult = await persistStagedImages(state.id);

                if (imageResult.partialFailure || !imageResult.success) {
                    EventBus.emit('show-toast', {
                        severity: 'warn',
                        summary: '',
                        detail: 'Room updated, but some new images failed to upload.',
                    });
                    await fetchRoom();
                    return;
                }
            }

            await router.push({ name: 'roomList' });
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response.message,
            });
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to update room.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        showConfirmDialog,
        confirmDeleteImage,
        submitted,
        errors,
        state,
        buildingOptions,
        typeOptions: ROOM_TYPE_OPTIONS,
        statusOptions: ROOM_STATUS_OPTIONS,
        stagedImages,
        persistedImages,
        addStagedFiles,
        removeStaged,
        setPrimary,
        replacePersistedImage,
    };
}
