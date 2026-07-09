import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

export default function useEditContract() {
    const store = useContractStore();
    const residentStore = useResidentStore();
    const roomStore = useRoomStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const residentOptions = ref([]);
    const roomOptions = ref([]);
    const paymentPlanOptions = ref([]);

    const state = reactive({
        id: null,
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
        status: '',
    });

    onMounted(async () => {
        await Promise.all([
            residentStore.fetchAll({ per_page: 100 }),
            roomStore.fetchAll({ per_page: 100 }),
            loadPaymentPlans(),
            fetchContract(),
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
            }));
        } catch {
            paymentPlanOptions.value = [];
        }
    };

    const fetchContract = async () => {
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
                await router.push({ name: 'showContract', params: { id: state.id } });
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
        residentOptions,
        roomOptions,
        paymentPlanOptions,
        handleSubmit,
        typeOptions: CONTRACT_TYPE_OPTIONS,
        paymentTypeOptions: PAYMENT_TYPE_OPTIONS,
    };
}
