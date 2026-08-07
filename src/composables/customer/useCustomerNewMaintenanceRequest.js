import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    MAINTENANCE_CATEGORY_OPTIONS,
    MAINTENANCE_PRIORITY_OPTIONS,
} from '@/constants/constant';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';

export default function useCustomerNewMaintenanceRequest() {
    const store = useCustomerMaintenanceRequestStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);

    const state = reactive({
        room_id: null,
        title: '',
        category: null,
        priority: null,
        description: '',
    });

    onMounted(async () => {
        isLoading.value = true;

        try {
            await store.fetchRooms();
            const rooms = store.getRoomsResponse?.data || [];
            roomOptions.value = rooms.map((room) => ({
                label: room.label || `${room.building_name || ''} · ${room.room_number}`.trim(),
                value: room.id,
            }));
        } catch (error) {
            showApiErrorToast(error, 'Unable to load rooms for maintenance requests.');
        } finally {
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        isSaving.value = true;
        errors.clear();

        try {
            await store.create({ ...state });
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
        categoryOptions: MAINTENANCE_CATEGORY_OPTIONS,
        priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        handleSubmit,
    };
}
