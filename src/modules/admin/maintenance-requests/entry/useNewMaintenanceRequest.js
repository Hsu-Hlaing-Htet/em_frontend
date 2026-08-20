import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    MAINTENANCE_CATEGORY_OPTIONS,
    MAINTENANCE_PRIORITY_OPTIONS,
} from '@/constants/constant';
import { useMaintenanceRequestStore } from '../store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useResidentStore } from '@/modules/admin/residents/store';

export default function useNewMaintenanceRequest() {
    const store = useMaintenanceRequestStore();
    const roomStore = useRoomStore();
    const residentStore = useResidentStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const residentOptions = ref([]);

    const state = reactive({
        room_id: null,
        user_id: null,
        title: '',
        category: null,
        priority: null,
        description: '',
    });

    bindErrorClearing(state, errors);

    onMounted(async () => {
        await Promise.all([
            roomStore.fetchAll({ per_page: 100 }),
            residentStore.fetchAll({ per_page: 100 }),
        ]);

        const rooms = roomStore.getAllResponse;
        if (rooms?.data?.data) {
            roomOptions.value = rooms.data.data.map((room) => ({
                label: `${room.building_name || ''} - ${room.room_number}`,
                value: room.id,
            }));
        }

        const residents = residentStore.getAllResponse;
        if (residents?.data?.data) {
            residentOptions.value = residents.data.data.map((resident) => ({
                label: resident.name,
                value: resident.id,
            }));
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'room_id', type: 'select' },
            { field: 'user_id', type: 'select' },
            { field: 'title', type: 'text' },
            { field: 'category', type: 'select' },
            { field: 'priority', type: 'select' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response?.data?.id) {
                await router.push({ name: 'showMaintenanceRequest', params: { id: response.data.id } });
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
                showApiErrorToast(error, 'Unable to save maintenance request.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        errors,
        state,
        roomOptions,
        residentOptions,
        categoryOptions: MAINTENANCE_CATEGORY_OPTIONS,
        priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        handleSubmit,
    };
}
