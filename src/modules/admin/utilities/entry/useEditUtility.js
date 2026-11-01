import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import {
    applyValidation,
    bindErrorClearing,
    isBlank,
    isValidNumber,
    requiredMessage,
    VALIDATION_MESSAGES,
} from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { useUtilityStore } from '../store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';
import { emptyUtilityItem, buildUtilityUpdatePayload, getCurrentReadingError } from '../utils/utilityFormHelpers';

export default function useEditUtility() {
    const store = useUtilityStore();
    const roomStore = useRoomStore();
    const utilityTypeStore = useUtilityTypeStore();
    const route = useRoute();
    const isLoading = ref(false);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const utilityTypeOptions = ref([]);
    const backRoute = { name: 'utilityList' };

    const state = reactive({
        id: null,
        room_id: null,
        contract_id: null,
        billing_month: null,
        reading_date: null,
        total_amount: 0,
        status: 'pending',
    });

    const items = ref([emptyUtilityItem()]);
    bindErrorClearing(state, errors);

    onMounted(async () => {
        isLoading.value = true;

        try {
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

            await fetchUtility();
        } catch (error) {
            showApiErrorToast(error, 'Unable to load utility.');
        } finally {
            isLoading.value = false;
        }
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
                ? response.data.items.map((item) => ({
                    ...item,
                    rowError: '',
                    currentReadingError: getCurrentReadingError(item.current_reading, item.previous_reading) ?? '',
                }))
                : [emptyUtilityItem()];
        }
    };

    const recalcItem = (item) => {
        item.currentReadingError = getCurrentReadingError(item.current_reading, item.previous_reading) ?? '';
        const usage = Math.max(0, Number(item.current_reading) - Number(item.previous_reading));
        item.usage = usage;
        item.amount = Number((usage * Number(item.unit_price)).toFixed(2));
        item.rowError = '';
    };

    const addItem = () => {
        items.value.push(emptyUtilityItem());
    };

    const removeItem = (index) => {
        if (items.value.length > 1) {
            items.value.splice(index, 1);
        }
    };

    const totalAmount = computed(() => (
        items.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    ));

    const canSave = computed(() => canEdit.value && Boolean(state.id)
        && !isLoading.value && !isSaving.value);

    const validateItems = () => {
        let valid = true;
        const fieldErrors = {};

        items.value.forEach((item) => {
            item.rowError = '';
            item.currentReadingError = '';
        });

        if (!items.value.length) {
            fieldErrors.utility_items = ['At least one utility item is required.'];
            valid = false;
        }

        items.value.forEach((item) => {
            if (isBlank(item.utility_type_id)) {
                item.rowError = VALIDATION_MESSAGES.select;
                fieldErrors.utility_type_id = [VALIDATION_MESSAGES.select];
                valid = false;
                return;
            }

            const currentReadingError = getCurrentReadingError(item.current_reading, item.previous_reading);

            if (currentReadingError) {
                item.currentReadingError = currentReadingError;
                fieldErrors.utility_items = [
                    fieldErrors.utility_items?.[0] || currentReadingError,
                ];
                valid = false;
                return;
            }

            if (!isValidNumber(item.previous_reading, { min: 0 })
                || !isValidNumber(item.current_reading, { min: 0 })) {
                item.rowError = requiredMessage('current_reading');
                fieldErrors.utility_items = [
                    fieldErrors.utility_items?.[0]
                    || 'Each item needs valid readings and unit price.',
                ];
                valid = false;
                return;
            }

            if (!isValidNumber(item.unit_price, { min: 0 })) {
                item.rowError = requiredMessage('unit_price');
                fieldErrors.unit_price = [requiredMessage('unit_price')];
                valid = false;
            }
        });

        if (Object.keys(fieldErrors).length) {
            errors.record(fieldErrors);
        }

        return valid;
    };

    const handleSubmit = async () => {
        if (!canSave.value) return;
        errors.clear();

        const stateValid = applyValidation(errors, state, [
            { field: 'room_id', type: 'select' },
            { field: 'billing_month', type: 'date' },
            { field: 'reading_date', type: 'date' },
        ]);
        const itemsValid = validateItems();

        if (!stateValid || !itemsValid) {
            return;
        }

        isSaving.value = true;

        const payload = buildUtilityUpdatePayload(state, items.value);
        const utilityId = state.id;

        try {
            await store.update({ ...payload, id: utilityId });
            const response = store.getUpdateResponse;

            if (response) {
                if (response.data?.id && Number(response.data.id) !== Number(utilityId)) {
                    throw new Error('The saved utility ID did not match the edited record.');
                }
                Object.assign(state, response.data, { id: utilityId });
                items.value = (response.data.items || []).map((item) => ({ ...item }));
                EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });
            }
        } catch (error) {
            if (error.status === 422 && (error.data?.data || error.data?.errors)) {
                errors.record(error.data.data || error.data.errors, false);
                showApiErrorToast(error, 'Unable to save utility.');
            } else {
                showApiErrorToast(error, 'Unable to save utility.');
            }
        } finally {
            isSaving.value = false;
        }
    };

    const canEdit = computed(() => ['pending', 'rejected'].includes(state.status));

    return {
        backRoute,
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
        canEdit,
        canSave,
    };
}
