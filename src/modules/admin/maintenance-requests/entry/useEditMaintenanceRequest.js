import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useMaintenanceRequestStore } from '../store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useResidentStore } from '@/modules/admin/residents/store';

export default function useEditMaintenanceRequest() {
    const store = useMaintenanceRequestStore();
    const roomStore = useRoomStore();
    const residentStore = useResidentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const residentOptions = ref([]);

    const state = reactive({
        id: null,
        room_id: null,
        user_id: null,
        title: '',
        description: '',
        status: '',
    });

    onMounted(async () => {
        await Promise.all([
            roomStore.fetchAll({ per_page: 100 }),
            residentStore.fetchAll({ per_page: 100 }),
            fetchRequest(),
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

    const fetchRequest = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        isSaving.value = true;
        errors.clear();

        try {
            await store.update({ ...state });
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'showMaintenanceRequest', params: { id: state.id } });
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
            isSaving.value = false;
        }
    };

    return {
        isLoading,
        isSaving,
        errors,
        state,
        roomOptions,
        residentOptions,
        handleSubmit,
    };
}
