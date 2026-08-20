import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { emptyUtilityItem } from '../utils/utilityFormHelpers';

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

    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'utilityApprovalList' }
            : { name: 'utilityList' }
    ));

    const state = reactive({
        id: null,
        room_id: null,
        billing_month: null,
        total_amount: 0,
        status: 'draft',
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
                ? response.data.items.map((item) => ({ ...item, rowError: '' }))
                : [emptyUtilityItem()];
        }
    };

    const recalcItem = (item) => {
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

    const validateItems = () => {
        let valid = true;
        const fieldErrors = {};

        items.value.forEach((item) => {
            item.rowError = '';
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

            if (Number(item.current_reading) < Number(item.previous_reading)) {
                item.rowError = 'Current reading must be greater than or equal to previous reading.';
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
        errors.clear();

        const stateValid = applyValidation(errors, state, [
            { field: 'room_id', type: 'select' },
            { field: 'billing_month', type: 'date' },
        ]);
        const itemsValid = validateItems();

        if (!stateValid || !itemsValid) {
            return;
        }

        isSaving.value = true;

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
            await store.update({ ...payload, id: state.id });
            const response = store.getUpdateResponse;

            if (response) {
                Object.assign(state, response.data);
                items.value = (response.data.items || []).map((item) => ({ ...item }));
                EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to save utility.');
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

                if (isApprovalView.value) {
                    if (action === 'approve') {
                        await router.push({ name: 'invoiceApprovalList' });
                    } else if (action === 'reject') {
                        await router.push({ name: 'utilityApprovalList' });
                    }
                }
            }
        } catch (error) {
            showApiErrorToast(error, `Unable to ${action} utility.`);
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const canEdit = computed(() => !isApprovalView.value && (!state.status || state.status === 'draft'));
    const canSubmit = () => !isApprovalView.value && state.status === 'draft';
    const canApprove = () => state.status === 'pending';
    const canReject = () => isApprovalView.value
        ? state.status === 'pending'
        : ['draft', 'pending'].includes(state.status);

    const documentRoute = computed(() => (
        state.id
            ? { name: 'utilityDocument', params: { id: state.id } }
            : null
    ));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
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
