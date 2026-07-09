import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useUtilityStore } from '../store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';

const emptyItem = () => ({
    id: null,
    utility_type_id: null,
    previous_reading: 0,
    current_reading: 0,
    usage: 0,
    unit_price: 0,
    amount: 0,
});

export default function useEditUtility() {
    const store = useUtilityStore();
    const roomStore = useRoomStore();
    const utilityTypeStore = useUtilityTypeStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(false);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const utilityTypeOptions = ref([]);
    const workflowLoading = ref({ submit: false, approve: false, reject: false });

    const isCreate = computed(() => route.name === 'newUtility');

    const state = reactive({
        id: null,
        room_id: null,
        billing_month: null,
        total_amount: 0,
        status: 'draft',
    });

    const items = ref([emptyItem()]);

    onMounted(async () => {
        isLoading.value = true;

        await Promise.all([
            roomStore.fetchAll({ per_page: 100 }),
            utilityTypeStore.fetchAll({ per_page: 100, status: 'active' }),
        ]);

        const rooms = roomStore.getAllResponse;
        if (rooms?.data?.data) {
            roomOptions.value = rooms.data.data.map((room) => ({
                label: `${room.building_name || ''} - ${room.room_number}`,
                value: room.id,
            }));
        }

        const types = utilityTypeStore.getAllResponse;
        if (types?.data?.data) {
            utilityTypeOptions.value = types.data.data.map((type) => ({
                label: type.name,
                value: type.id,
            }));
        }

        if (!isCreate.value) {
            await fetchUtility();
        }

        isLoading.value = false;
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchUtility = async () => {
        await store.fetchOne({ id: route.params.id });
        const response = store.getOneResponse;

        if (response?.data) {
            Object.assign(state, response.data);
            items.value = (response.data.items || []).length
                ? response.data.items.map((item) => ({ ...item }))
                : [emptyItem()];
        }
    };

    const recalcItem = (item) => {
        const usage = Math.max(0, Number(item.current_reading) - Number(item.previous_reading));
        item.usage = usage;
        item.amount = Number((usage * Number(item.unit_price)).toFixed(2));
    };

    const addItem = () => {
        items.value.push(emptyItem());
    };

    const removeItem = (index) => {
        if (items.value.length > 1) {
            items.value.splice(index, 1);
        }
    };

    const totalAmount = computed(() => items.value.reduce((sum, item) => sum + Number(item.amount || 0), 0));

    const handleSubmit = async () => {
        isSaving.value = true;
        errors.clear();

        const payload = {
            ...state,
            utility_items: items.value.map((item) => ({
                id: item.id || undefined,
                utility_type_id: item.utility_type_id,
                previous_reading: item.previous_reading,
                current_reading: item.current_reading,
                unit_price: item.unit_price,
            })),
        };

        try {
            if (isCreate.value) {
                await store.add(payload);
                const response = store.getAddResponse;

                if (response?.data?.id) {
                    await router.push({ name: 'editUtility', params: { id: response.data.id } });
                    EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });
                }
            } else {
                await store.update({ ...payload, id: state.id });
                const response = store.getUpdateResponse;

                if (response) {
                    Object.assign(state, response.data);
                    items.value = (response.data.items || []).map((item) => ({ ...item }));
                    EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });
                }
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            }
        } finally {
            isSaving.value = false;
        }
    };

    const runWorkflow = async (action) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });
            }
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const canEdit = computed(() => !state.status || state.status === 'draft');
    const canSubmit = () => state.status === 'draft';
    const canApprove = () => state.status === 'pending';
    const canReject = () => ['draft', 'pending'].includes(state.status);

    return {
        isCreate,
        isLoading,
        isSaving,
        errors,
        state,
        items,
        roomOptions,
        utilityTypeOptions,
        totalAmount,
        addItem,
        removeItem,
        recalcItem,
        handleSubmit,
        workflowLoading,
        runWorkflow,
        canEdit,
        canSubmit,
        canApprove,
        canReject,
    };
}
