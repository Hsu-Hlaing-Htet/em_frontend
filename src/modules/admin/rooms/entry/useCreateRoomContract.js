import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useSaleContractDraftStore } from '@/modules/admin/sale-contracts/store';
import { useRentContractDraftStore } from '@/modules/admin/rent-contracts/store';
import { mapSaleDraftToApi } from '@/modules/admin/sale-contracts/draft/mapSaleDraft';
import { mapRentDraftToApi } from '@/modules/admin/rent-contracts/draft/mapRentDraft';
import useSaleDraftForm from '@/modules/admin/sale-contracts/draft/useSaleDraftForm';
import useRentDraftForm from '@/modules/admin/rent-contracts/draft/useRentDraftForm';

function asOptionArray(value) {
    const resolved = unref(value);

    return Array.isArray(resolved) ? resolved : [];
}

const SALE_VALIDATION_RULES = [
    { field: 'user_id', type: 'select' },
    { field: 'building_id', type: 'select' },
    { field: 'room_id', type: 'select' },
    { field: 'payment_type', type: 'select' },
    { field: 'start_date', type: 'date' },
    {
        field: 'duration_months',
        type: 'select',
        when: (values) => values.payment_type === 'installment',
    },
];

const RENT_VALIDATION_RULES = [
    { field: 'user_id', type: 'select' },
    { field: 'building_id', type: 'select' },
    { field: 'room_id', type: 'select' },
    { field: 'payment_type', type: 'select' },
    { field: 'start_date', type: 'date' },
    {
        field: 'duration_months',
        type: 'select',
        when: (values) => values.payment_type === 'installment',
    },
];

const CONTRACT_TYPE_OPTIONS = Object.freeze([
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
]);

function normalizeContractType(value) {
    if (value === 'sale' || value === 'rent') {
        return value;
    }

    if (value && typeof value === 'object') {
        const nested = value.value;

        if (nested === 'sale' || nested === 'rent') {
            return nested;
        }
    }

    return null;
}

export default function useCreateRoomContract() {
    const route = useRoute();
    const router = useRouter();
    const roomStore = useRoomStore();
    const saleStore = useSaleContractDraftStore();
    const rentStore = useRentContractDraftStore();

    const isLoading = ref(true);
    const isSaving = ref(false);
    const isBootstrapping = ref(false);
    const errors = new Errors();
    const contractType = ref(null);
    const room = ref(null);

    const saleForm = useSaleDraftForm();
    const rentForm = useRentDraftForm();

    // Unwrap nested composable computeds so Dropdown always receives plain arrays.
    const saleCustomerOptions = computed(() => asOptionArray(saleForm.customerOptions));
    const saleBuildingOptions = computed(() => asOptionArray(saleForm.buildingOptions));
    const saleRoomOptions = computed(() => asOptionArray(saleForm.roomOptions));
    const salePaymentTypeOptions = computed(() => asOptionArray(saleForm.paymentTypeOptions));
    const saleDurationMonthOptions = computed(() => asOptionArray(saleForm.durationMonthOptions));
    const rentCustomerOptions = computed(() => asOptionArray(rentForm.customerOptions));
    const rentBuildingOptions = computed(() => asOptionArray(rentForm.buildingOptions));
    const rentRoomOptions = computed(() => asOptionArray(rentForm.roomOptions));
    const rentPaymentTypeOptions = computed(() => asOptionArray(rentForm.paymentTypeOptions));
    const rentDurationMonthOptions = computed(() => asOptionArray(rentForm.durationMonthOptions));

    bindErrorClearing(saleForm.state, errors);
    bindErrorClearing(rentForm.state, errors);

    // Always an array of { label, value } — never the raw room type string.
    const contractTypeOptions = computed(() => {
        const roomType = String(room.value?.type || '').toLowerCase();

        if (roomType === 'sale') {
            return CONTRACT_TYPE_OPTIONS.filter((option) => option.value === 'sale');
        }

        if (roomType === 'rent') {
            return CONTRACT_TYPE_OPTIONS.filter((option) => option.value === 'rent');
        }

        if (roomType === 'both') {
            return [...CONTRACT_TYPE_OPTIONS];
        }

        return [];
    });

    const activeForm = computed(() => (
        contractType.value === 'rent' ? rentForm : saleForm
    ));

    const cancelRoute = computed(() => ({
        name: 'showRoom',
        params: { id: route.params.id },
    }));

    const buildingLabel = computed(() => room.value?.building_name || '—');

    const roomLabel = computed(() => room.value?.room_number || '—');

    const lockPropertyOnForm = async (form, type) => {
        if (!room.value || !type) {
            return;
        }

        const isRent = type === 'rent';

        await form.loadState({
            building_id: room.value.building_id,
            room_id: room.value.id,
            payment_type: isRent ? 'full' : 'installment',
            room_price: isRent ? room.value.rent_price : room.value.sale_price,
            deposit_amount: isRent ? room.value.rent_deposit_price : room.value.booking_deposit_price,
            contract_total: isRent ? room.value.rent_price : room.value.sale_price,
            room: {
                id: room.value.id,
                building_id: room.value.building_id,
                room_number: room.value.room_number,
                type: room.value.type,
                status: room.value.status,
                sale_price: room.value.sale_price,
                rent_price: room.value.rent_price,
                rent_deposit_price: room.value.rent_deposit_price,
                booking_deposit_price: room.value.booking_deposit_price,
            },
            building: {
                id: room.value.building_id,
                building_name: room.value.building_name,
            },
            building_name: room.value.building_name,
        });
    };

    watch(contractType, async (type) => {
        const normalized = normalizeContractType(type);

        if (normalized !== type) {
            contractType.value = normalized;
            return;
        }

        errors.clear();

        if (isBootstrapping.value || !normalized || !room.value) {
            return;
        }

        try {
            await lockPropertyOnForm(normalized === 'rent' ? rentForm : saleForm, normalized);
        } catch (error) {
            showApiErrorToast(error, 'Unable to prepare contract form.');
        }
    });

    watch(() => saleForm.state.customer_id, () => {
        if (errors.has('user_id')) {
            errors.clear('user_id');
        }
    });

    watch(() => rentForm.state.customer_id, () => {
        if (errors.has('user_id')) {
            errors.clear('user_id');
        }
    });

    watch(() => saleForm.state.second_customer_id, () => {
        if (errors.has('second_user_id')) {
            errors.clear('second_user_id');
        }
    });

    watch(() => rentForm.state.second_customer_id, () => {
        if (errors.has('second_user_id')) {
            errors.clear('second_user_id');
        }
    });

    onMounted(async () => {
        isLoading.value = true;
        isBootstrapping.value = true;

        try {
            const roomId = route.params.id;

            if (!roomId) {
                throw new Error('Room id is missing.');
            }

            await roomStore.fetchOne({ id: roomId });
            const response = roomStore.getOneResponse;
            room.value = response?.data || null;

            if (!room.value?.id) {
                throw new Error('Room not found.');
            }

            if (String(room.value.status || '').toLowerCase() !== 'available') {
                EventBus.emit('show-toast', {
                    severity: 'warn',
                    summary: '',
                    detail: 'Only available rooms can start a new contract.',
                });
                await router.replace({ name: 'showRoom', params: { id: room.value.id } });
                return;
            }

            const options = Array.isArray(contractTypeOptions.value)
                ? contractTypeOptions.value
                : [];

            if (!options.length) {
                EventBus.emit('show-toast', {
                    severity: 'warn',
                    summary: '',
                    detail: 'This room type cannot create a contract.',
                });
                await router.replace({ name: 'showRoom', params: { id: room.value.id } });
                return;
            }

            // Selected value must be 'sale' | 'rent', never the options list/object.
            contractType.value = normalizeContractType(options[0]?.value);

            if (contractType.value) {
                await lockPropertyOnForm(
                    contractType.value === 'rent' ? rentForm : saleForm,
                    contractType.value,
                );
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load room for contract.');
            await router.replace({ name: 'roomList' });
        } finally {
            isBootstrapping.value = false;
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        saleStore.$reset();
        rentStore.$reset();
        roomStore.$reset();
    });

    const handleSubmit = async () => {
        if (!contractType.value) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Select Sale or Rent before submitting.',
            });
            return;
        }

        const form = activeForm.value;
        form.submitted.value = true;
        errors.clear();

        const values = {
            ...form.state,
            user_id: form.state.customer_id,
        };

        const rules = contractType.value === 'rent' ? RENT_VALIDATION_RULES : SALE_VALIDATION_RULES;

        if (!applyValidation(errors, values, rules)) {
            return;
        }

        if (
            form.state.show_second_customer
            && form.state.second_customer_id
            && Number(form.state.second_customer_id) === Number(form.state.customer_id)
        ) {
            errors.record({
                second_user_id: ['Second customer must be different from the first customer.'],
            });
            return;
        }

        isSaving.value = true;

        try {
            if (contractType.value === 'rent') {
                await rentStore.add(mapRentDraftToApi(form.state));
                const response = rentStore.getAddResponse;

                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response?.message || 'Rent contract submitted for approval.',
                });

                await router.push({ name: 'rentContractApprovalList' });
            } else {
                await saleStore.add(mapSaleDraftToApi(form.state));
                const response = saleStore.getAddResponse;

                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response?.message || 'Sale contract submitted for approval.',
                });

                await router.push({ name: 'saleContractApprovalList' });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data?.data || error.data?.errors || {});
                const apiMessage = String(error.data?.message || '').trim();
                if (apiMessage && !errors.any()) {
                    EventBus.emit('show-toast', {
                        severity: 'warn',
                        summary: '',
                        detail: apiMessage,
                    });
                }
            } else {
                showApiErrorToast(error, 'Unable to submit contract for approval.');
            }
        } finally {
            isSaving.value = false;
        }
    };

    return {
        isLoading,
        isSaving,
        errors,
        room,
        buildingLabel,
        roomLabel,
        contractType,
        contractTypeOptions,
        saleForm,
        rentForm,
        saleCustomerOptions,
        saleBuildingOptions,
        saleRoomOptions,
        salePaymentTypeOptions,
        saleDurationMonthOptions,
        rentCustomerOptions,
        rentBuildingOptions,
        rentRoomOptions,
        rentPaymentTypeOptions,
        rentDurationMonthOptions,
        cancelRoute,
        handleSubmit,
    };
}
