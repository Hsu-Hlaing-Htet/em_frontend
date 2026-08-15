import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useRoomStore } from '../store';
import { useBuildingStore } from '@/modules/admin/buildings/store';
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from '@/constants/constant';
import useRoomImages from './useRoomImages';
import useRoomDimensions from '@/composables/admin/rooms/useRoomDimensions';
import { buildRoomPayload } from '../roomForm';
import { showApiErrorToast } from '@/utils/apiError';

export default function useNewRoom() {
    const store = useRoomStore();
    const buildingStore = useBuildingStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);
    const buildingOptions = ref([]);

    const {
        stagedImages,
        persistedImages,
        addStagedFiles,
        removeStaged,
        setPrimary,
        persistStagedImages,
        replacePersistedImage,
        resetImages,
    } = useRoomImages();

    const state = reactive({
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

    useRoomDimensions(state);

    onMounted(async () => {
        await buildingStore.fetchAll({ per_page: 100 });
        const response = buildingStore.getAllResponse;

        if (response?.data?.data) {
            buildingOptions.value = response.data.data
                .filter((building) => building.status === 'active')
                .map((building) => ({
                label: building.building_name,
                value: building.id,
                }));
        }
    });

    onBeforeUnmount(() => {
        resetImages();
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.add(buildRoomPayload(state));
            const response = store.getAddResponse;

            if (!response?.data?.id) {
                return;
            }

            const roomId = response.data.id;

            if (stagedImages.value.length) {
                const imageResult = await persistStagedImages(roomId);

                if (imageResult.partialFailure || !imageResult.success) {
                    EventBus.emit('show-toast', {
                        severity: 'warn',
                        summary: '',
                        detail: 'Room created, but some images failed to upload. Please retry on the edit page.',
                    });
                    await router.push({ name: 'editRoom', params: { id: roomId } });
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
                showApiErrorToast(error, 'Unable to create room.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        submitted,
        errors,
        state,
        buildingOptions,
        typeOptions: ROOM_TYPE_OPTIONS,
        statusOptions: ROOM_STATUS_OPTIONS.filter((option) => option.value !== 'inactive'),
        stagedImages,
        persistedImages,
        addStagedFiles,
        removeStaged,
        setPrimary,
        replacePersistedImage,
    };
}
