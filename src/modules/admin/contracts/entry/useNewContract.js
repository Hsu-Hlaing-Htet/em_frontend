import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/libs/axios';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { endpoint } from '@/constants/endpoint';
import {
    CONTRACT_TYPE_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from '@/constants/constant';
import { useContractStore } from '../store';
import { useResidentStore } from '@/modules/admin/residents/store';
import { useRoomStore } from '@/modules/admin/rooms/store';

const STEPS = [
    { label: 'Customer' },
    { label: 'Room' },
    { label: 'Plan' },
    { label: 'Terms' },
    { label: 'Review' },
];

export default function useNewContract() {
    const store = useContractStore();
    const residentStore = useResidentStore();
    const roomStore = useRoomStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const activeStep = ref(0);
    const residentOptions = ref([]);
    const roomOptions = ref([]);
    const paymentPlanOptions = ref([]);

    const state = reactive({
        user_id: null,
        room_id: null,
        payment_plan_id: null,
        contract_total: null,
        type: 'rent',
        payment_type: 'full',
        duration_months: null,
        start_date: null,
        end_date: null,
        billing_day: 1,
        remark: '',
    });

    const selectedResident = computed(() => residentOptions.value.find((item) => item.value === state.user_id));
    const selectedRoom = computed(() => roomOptions.value.find((item) => item.value === state.room_id));
    const selectedPlan = computed(() => paymentPlanOptions.value.find((item) => item.value === state.payment_plan_id));

    onMounted(async () => {
        await Promise.all([
            residentStore.fetchAll({ per_page: 100 }),
            roomStore.fetchAll({ per_page: 100, status: 'available' }),
            loadPaymentPlans(),
        ]);

        const residents = residentStore.getAllResponse;
        if (residents?.data?.data) {
            residentOptions.value = residents.data.data.map((resident) => ({
                label: `${resident.name} (${resident.email})`,
                value: resident.id,
            }));
        }

        const rooms = roomStore.getAllResponse;
        if (rooms?.data?.data) {
            roomOptions.value = rooms.data.data.map((room) => ({
                label: `${room.building_name || ''} - ${room.room_number}`,
                value: room.id,
            }));
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const loadPaymentPlans = async () => {
        try {
            const result = await api.get(endpoint.paymentPlans, { params: { per_page: 100 } });
            const plans = result.data?.data?.data || [];

            paymentPlanOptions.value = plans.map((plan) => ({
                label: plan.name,
                value: plan.id,
                payment_type: plan.payment_type,
                duration_months: plan.duration_months,
            }));
        } catch {
            paymentPlanOptions.value = [];
        }
    };

    const onPlanChange = () => {
        const plan = selectedPlan.value;
        if (plan) {
            state.payment_type = plan.payment_type;
            state.duration_months = plan.duration_months;
        }
    };

    const canGoNext = computed(() => {
        if (activeStep.value === 0) {
            return Boolean(state.user_id);
        }
        if (activeStep.value === 1) {
            return Boolean(state.room_id);
        }
        if (activeStep.value === 2) {
            return Boolean(state.type);
        }
        return true;
    });

    const nextStep = () => {
        if (activeStep.value < STEPS.length - 1 && canGoNext.value) {
            activeStep.value += 1;
        }
    };

    const prevStep = () => {
        if (activeStep.value > 0) {
            activeStep.value -= 1;
        }
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'contractList' });
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
            isLoading.value = false;
        }
    };

    return {
        STEPS,
        activeStep,
        isLoading,
        errors,
        state,
        residentOptions,
        roomOptions,
        paymentPlanOptions,
        selectedResident,
        selectedRoom,
        selectedPlan,
        canGoNext,
        nextStep,
        prevStep,
        onPlanChange,
        handleSubmit,
        typeOptions: CONTRACT_TYPE_OPTIONS,
        paymentTypeOptions: PAYMENT_TYPE_OPTIONS,
    };
}
