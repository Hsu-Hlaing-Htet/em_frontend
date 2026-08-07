import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';

export default function useCustomerShowMaintenanceRequest() {
    const store = useCustomerMaintenanceRequestStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        room_id: null,
        room_number: '',
        building_name: '',
        title: '',
        category: '',
        priority: '',
        description: '',
        status: '',
        rejection_reason: '',
        resolution_note: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
        updated_at: '',
    });

    const fetchRequest = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance request.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRequest();
        }
    });

    onMounted(fetchRequest);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        state,
    };
}
