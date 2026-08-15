import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue';
import { service as residentService } from '@/modules/admin/residents/service';
import { service as buildingService } from '@/modules/admin/buildings/service';
import { service as roomService } from '@/modules/admin/rooms/service';
import {
    PAYMENT_TYPE_OPTIONS,
    DURATION_MONTHS_OPTIONS,
    BILLING_DAY_OPTIONS,
} from '@/constants/constant';
import { formatCurrency } from '@/utils/formatter';
import {
    estimateMonthlyPayment,
    remainingAfterDeposit,
} from '@/helpers/contracts/contractDocument';
import { mapRentDraftFormFromApi } from './mapRentDraft';

export default function useRentDraftForm(initialState = null) {
    const submitted = ref(false);
    const isHydrating = ref(false);
    const customers = ref([]);
    const buildings = ref([]);
    const rooms = ref([]);

    const state = reactive({
        id: null,
        customer_id: null,
        customer_nrc: '',
        customer_phone: '',
        customer_email: '',
        building_id: null,
        room_id: null,
        room_price: 0,
        deposit: 0,
        payment_type: 'installment',
        duration_months: null,
        contract_total: 0,
        start_date: null,
        billing_day: null,
        remarks: '',
    });

    const customerOptions = computed(() => customers.value.filter((customer) => customer.status === 'active').map((customer) => ({
        label: customer.name,
        value: customer.id,
    })));

    const buildingOptions = computed(() => buildings.value.filter((building) => building.status === 'active').map((building) => ({
        label: building.building_name,
        value: building.id,
    })));

    const roomOptions = computed(() => rooms.value.filter((room) => room.status === 'available').map((room) => ({
        label: room.room_number,
        value: room.id,
    })));

    const showInstallmentFields = computed(() => state.payment_type === 'installment');

    const showPaymentSummary = computed(() => (
        state.payment_type === 'installment' && Boolean(state.duration_months)
    ));

    const paymentSummary = computed(() => {
        const remaining = remainingAfterDeposit(state.contract_total, state.deposit);
        const monthly = estimateMonthlyPayment({
            paymentType: state.payment_type,
            contractTotal: state.contract_total,
            deposit: state.deposit,
            durationMonths: state.duration_months,
        });

        return {
            deposit: formatCurrency(state.deposit),
            remainingBalance: formatCurrency(remaining),
            duration: state.duration_months ? `${state.duration_months} months` : '—',
            estimatedMonthlyPayment: formatCurrency(monthly),
        };
    });

    const applyCustomer = (customerId) => {
        const customer = customers.value.find((item) => item.id === customerId);

        if (!customer) {
            state.customer_nrc = '';
            state.customer_phone = '';
            state.customer_email = '';

            return;
        }

        state.customer_nrc = customer.nrc || '';
        state.customer_phone = customer.phone || '';
        state.customer_email = customer.email || '';
    };

    const applyRoom = (roomId, { preserveContractTotal = false } = {}) => {
        const room = rooms.value.find((item) => item.id === roomId);

        if (!room) {
            state.room_price = 0;
            state.deposit = 0;

            if (!preserveContractTotal) {
                state.contract_total = 0;
            }

            return;
        }

        state.room_price = Number(room.rent_price) || 0;
        state.deposit = Number(room.rent_deposit_price) || 0;

        if (!preserveContractTotal) {
            state.contract_total = Number(room.rent_price) || 0;
        }
    };

    const fetchCustomers = async () => {
        const response = await residentService.getAll({ per_page: 100 });

        customers.value = response?.data?.data || [];
    };

    const fetchBuildings = async () => {
        const response = await buildingService.getAll({ per_page: 100 });

        buildings.value = response?.data?.data || [];
    };

    const fetchRooms = async (buildingId) => {
        if (!buildingId) {
            rooms.value = [];

            return;
        }

        const response = await roomService.getAll({
            building_id: buildingId,
            per_page: 100,
        });

        rooms.value = (response?.data?.data || []).filter(
            (room) => ['rent', 'both'].includes(room.type),
        );
    };

    watch(() => state.customer_id, (customerId) => {
        if (isHydrating.value) {
            return;
        }

        applyCustomer(customerId);
    });

    watch(() => state.building_id, async (buildingId) => {
        if (isHydrating.value) {
            await fetchRooms(buildingId);

            return;
        }

        state.room_id = null;
        await fetchRooms(buildingId);
        applyRoom(null);
    });

    watch(() => state.room_id, (roomId) => {
        if (isHydrating.value) {
            return;
        }

        applyRoom(roomId);
    });

    watch(() => state.payment_type, (paymentType) => {
        if (isHydrating.value) {
            return;
        }

        if (paymentType === 'full') {
            state.duration_months = null;
            state.billing_day = null;
        }
    });

    const loadState = async (data) => {
        if (!data) {
            return;
        }

        isHydrating.value = true;

        const buildingId = data.building_id ?? data.room?.building_id ?? null;

        if (buildingId) {
            await fetchRooms(buildingId);
        }

        if (data.room && !rooms.value.some((room) => room.id === data.room.id)) {
            rooms.value = [...rooms.value, data.room];
        }

        const mapped = mapRentDraftFormFromApi(data) || data;

        Object.assign(state, {
            id: mapped.id,
            customer_id: mapped.customer_id,
            customer_nrc: mapped.customer_nrc || '',
            customer_phone: mapped.customer_phone || '',
            customer_email: mapped.customer_email || '',
            building_id: mapped.building_id,
            room_id: mapped.room_id,
            room_price: mapped.room_price,
            deposit: mapped.deposit,
            payment_type: mapped.payment_type,
            duration_months: mapped.payment_type === 'full' ? null : mapped.duration_months,
            contract_total: mapped.contract_total,
            start_date: mapped.start_date,
            billing_day: mapped.payment_type === 'full' ? null : mapped.billing_day,
            remarks: mapped.remarks || '',
        });

        await nextTick();
        isHydrating.value = false;
    };

    onMounted(async () => {
        await Promise.all([fetchCustomers(), fetchBuildings()]);

        if (initialState) {
            await loadState(initialState);
        }
    });

    return {
        state,
        submitted,
        customerOptions,
        buildingOptions,
        roomOptions,
        paymentTypeOptions: PAYMENT_TYPE_OPTIONS,
        durationMonthOptions: DURATION_MONTHS_OPTIONS,
        billingDayOptions: BILLING_DAY_OPTIONS,
        showInstallmentFields,
        showPaymentSummary,
        paymentSummary,
        loadState,
    };
}
