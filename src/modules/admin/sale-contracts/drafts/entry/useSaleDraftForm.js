import { reactive, ref, computed, watch } from 'vue';
import {
    MOCK_CUSTOMERS,
    MOCK_BUILDINGS,
    MOCK_ROOMS,
} from '../../mockData';
import {
    PAYMENT_TYPE_OPTIONS,
    DURATION_MONTHS_OPTIONS,
    BILLING_DAY_OPTIONS,
} from '@/constants/constant';
import { parseDate, formatCurrency } from '@/utils/formatter';
import {
    estimateMonthlyPayment,
    remainingAfterDeposit,
} from '@/utils/contractDocument';

export default function useSaleDraftForm(initialState = null) {
    const submitted = ref(false);

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
        payment_plan: 'standard',
        payment_type: 'installment',
        duration_months: null,
        contract_total: 0,
        start_date: null,
        billing_day: 1,
        remarks: '',
    });

    const customerOptions = computed(() => MOCK_CUSTOMERS.map((customer) => ({
        label: customer.name,
        value: customer.id,
    })));

    const buildingOptions = computed(() => MOCK_BUILDINGS.map((building) => ({
        label: building.building_name,
        value: building.id,
    })));

    const roomOptions = computed(() => MOCK_ROOMS
        .filter((room) => room.building_id === state.building_id)
        .map((room) => ({
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
        const customer = MOCK_CUSTOMERS.find((item) => item.id === customerId);

        if (!customer) {
            state.customer_nrc = '';
            state.customer_phone = '';
            state.customer_email = '';

            return;
        }

        state.customer_nrc = customer.nrc;
        state.customer_phone = customer.phone;
        state.customer_email = customer.email;
    };

    const applyRoom = (roomId) => {
        const room = MOCK_ROOMS.find((item) => item.id === roomId);

        if (!room) {
            state.room_price = 0;
            state.deposit = 0;
            state.contract_total = 0;

            return;
        }

        state.room_price = room.sale_price;
        state.deposit = room.booking_deposit_price;
        state.contract_total = room.sale_price;
    };

    watch(() => state.customer_id, (customerId) => {
        applyCustomer(customerId);
    });

    watch(() => state.building_id, () => {
        state.room_id = null;
        applyRoom(null);
    });

    watch(() => state.room_id, (roomId) => {
        applyRoom(roomId);
    });

    watch(() => state.payment_type, (paymentType) => {
        if (paymentType === 'full') {
            state.duration_months = null;
        }
    });

    const loadState = (data) => {
        if (!data) {
            return;
        }

        Object.assign(state, {
            id: data.id,
            customer_id: data.customer_id,
            customer_nrc: data.customer_nrc,
            customer_phone: data.customer_phone,
            customer_email: data.customer_email,
            building_id: data.building_id,
            room_id: data.room_id,
            room_price: data.room_price,
            deposit: data.deposit,
            payment_plan: data.payment_plan,
            payment_type: data.payment_type,
            duration_months: data.payment_type === 'full' ? null : data.duration_months,
            contract_total: data.contract_total,
            start_date: parseDate(data.start_date),
            billing_day: data.billing_day,
            remarks: data.remarks || '',
        });
    };

    if (initialState) {
        loadState(initialState);
    }

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
