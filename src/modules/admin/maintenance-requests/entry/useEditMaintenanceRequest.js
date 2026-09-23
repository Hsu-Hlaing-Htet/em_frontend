import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { MAINTENANCE_PRIORITY_OPTIONS } from '@/constants/constant';
import { useMaintenanceRequestStore } from '../store';
import { useMaintenanceCategoryStore } from '@/modules/admin/maintenance-categories/store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useResidentStore } from '@/modules/admin/residents/store';

export default function useEditMaintenanceRequest() {
    const store = useMaintenanceRequestStore();
    const categoryStore = useMaintenanceCategoryStore();
    const roomStore = useRoomStore();
    const residentStore = useResidentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const residentOptions = ref([]);
    const categoryOptions = ref([]);

    const state = reactive({
        id: null,
        room_id: null,
        user_id: null,
        title: '',
        category: null,
        priority: null,
        description: '',
        status: '',
    });

    bindErrorClearing(state, errors);

    onMounted(async () => {
        await Promise.all([
            roomStore.fetchAll({ per_page: 100 }),
            residentStore.fetchAll({ per_page: 100 }),
            categoryStore.fetchOptions(),
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

        const categories = categoryStore.getOptionsResponse?.data || [];
        categoryOptions.value = categories.map((category) => ({
            label: category.name,
            value: category.slug,
        }));

        // Keep historical inactive category visible on edit.
        if (
            state.category
            && !categoryOptions.value.some((option) => option.value === state.category)
        ) {
            categoryOptions.value = [
                {
                    label: state.category,
                    value: state.category,
                },
                ...categoryOptions.value,
            ];
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
        categoryStore.$reset();
        categoryStore.$dispose();
    });

    const fetchRequest = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    room_id: response.data.room_id,
                    user_id: response.data.user_id,
                    title: response.data.title,
                    category: response.data.category,
                    priority: response.data.priority,
                    description: response.data.description || '',
                    status: response.data.status,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance request.');
        } finally {
            isLoading.value = false;
        }
    };

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

        isSaving.value = true;

        try {
            await store.update({
                id: state.id,
                room_id: state.room_id,
                user_id: state.user_id,
                title: state.title,
                category: state.category,
                priority: state.priority,
                description: state.description || null,
            });
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
                errors.record(error.data?.data || error.data?.errors || {});
            } else {
                showApiErrorToast(error, 'Unable to save maintenance request.');
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
        categoryOptions,
        priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        handleSubmit,
    };
}
