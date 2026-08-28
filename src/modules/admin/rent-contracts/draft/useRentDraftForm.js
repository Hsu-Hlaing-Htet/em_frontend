import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue';
import { service as residentService } from '@/modules/admin/residents/service';
import { service as buildingService } from '@/modules/admin/buildings/service';
import {
    PAYMENT_TYPE_OPTIONS,
    DURATION_MONTHS_OPTIONS,
} from '@/constants/constant';
import { formatCurrency } from '@/utils/formatter';
import {
    calculateRentContractTotal,
    estimateMonthlyPayment,
    remainingContractBalance,
} from '@/helpers/contracts/contractDocument';
import {
    fetchRoomsForBuilding,
    mapDraftBuildingOptions,
    mapDraftRoomOptions,
    resolveEntityId,
    sameEntityId,
} from '@/helpers/contracts/draftBuildingRooms';
import { mapRentDraftFormFromApi } from './mapRentDraft';

const RENT_ROOM_TYPES = ['rent', 'both'];

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
        remarks: '',
    });

    const customerOptions = computed(() => customers.value.filter((customer) => customer.status === 'active').map((customer) => ({
        label: customer.name,
        value: resolveEntityId(customer.id),
    })).filter((option) => option.value != null));

    const buildingOptions = computed(() => mapDraftBuildingOptions(buildings.value));

    const roomOptions = computed(() => mapDraftRoomOptions(rooms.value, {
        selectedRoomId: state.room_id,
        allowedTypes: RENT_ROOM_TYPES,
    }));

    const showInstallmentFields = computed(() => state.payment_type === 'installment');

    const showPaymentSummary = computed(() => (
        state.payment_type === 'installment' && Boolean(state.duration_months)
    ));

    const paymentSummary = computed(() => {
        const remaining = remainingContractBalance({
            contractType: 'rent',
            contractTotal: state.contract_total,
            deposit: state.deposit,
        });
        const monthly = estimateMonthlyPayment({
            contractType: 'rent',
            paymentType: state.payment_type,
            contractTotal: state.contract_total,
            deposit: state.deposit,
            durationMonths: state.duration_months,
            roomPrice: state.room_price,
        });

        return {
            deposit: formatCurrency(state.deposit),
            remainingBalance: formatCurrency(remaining),
            duration: state.duration_months ? `${state.duration_months} months` : '—',
            estimatedMonthlyPayment: formatCurrency(monthly),
        };
    });

    const applyCustomer = (customerId) => {
        const customer = customers.value.find((item) => sameEntityId(item.id, customerId));

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
        const room = rooms.value.find((item) => sameEntityId(item.id, roomId));

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
            state.contract_total = calculateRentContractTotal(state.room_price, state.duration_months);
        }
    };

    const applyRentContractTotal = () => {
        state.contract_total = calculateRentContractTotal(state.room_price, state.duration_months);
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
        rooms.value = await fetchRoomsForBuilding(buildingId, {
            allowedTypes: RENT_ROOM_TYPES,
        });
    };

    watch(() => state.customer_id, (customerId) => {
        if (isHydrating.value) {
            return;
        }

        const normalizedCustomerId = resolveEntityId(customerId);

        if (normalizedCustomerId !== customerId) {
            state.customer_id = normalizedCustomerId;
        }

        applyCustomer(normalizedCustomerId);
    });

    watch(() => state.building_id, async (buildingId) => {
        const normalizedBuildingId = resolveEntityId(buildingId);

        if (normalizedBuildingId !== buildingId) {
            state.building_id = normalizedBuildingId;

            return;
        }

        if (isHydrating.value) {
            await fetchRooms(normalizedBuildingId);

            return;
        }

        state.room_id = null;
        await fetchRooms(normalizedBuildingId);
        applyRoom(null);
    });

    watch(() => state.room_id, (roomId) => {
        if (isHydrating.value) {
            return;
        }

        const normalizedRoomId = resolveEntityId(roomId);

        if (normalizedRoomId !== roomId) {
            state.room_id = normalizedRoomId;

            return;
        }

        applyRoom(normalizedRoomId);
    });

    watch(() => state.payment_type, (paymentType) => {
        if (isHydrating.value) {
            return;
        }

        if (paymentType === 'full') {
            state.duration_months = null;
        }
    });

    watch(() => state.duration_months, () => {
        if (isHydrating.value) {
            return;
        }

        applyRentContractTotal();
    });

    const loadState = async (data) => {
        if (!data) {
            return;
        }

        isHydrating.value = true;

        const buildingId = resolveEntityId(
            data.building_id ?? data.room?.building_id ?? data.building?.id ?? null,
        );

        if (buildingId) {
            await fetchRooms(buildingId);
        } else {
            rooms.value = [];
        }

        if (data.room && !rooms.value.some((room) => sameEntityId(room.id, data.room.id))) {
            rooms.value = [...rooms.value, data.room];
        }

        const mapped = mapRentDraftFormFromApi(data) || data;

        Object.assign(state, {
            id: mapped.id,
            customer_id: resolveEntityId(mapped.customer_id),
            customer_nrc: mapped.customer_nrc || '',
            customer_phone: mapped.customer_phone || '',
            customer_email: mapped.customer_email || '',
            building_id: buildingId,
            room_id: resolveEntityId(mapped.room_id),
            room_price: mapped.room_price,
            deposit: mapped.deposit,
            payment_type: mapped.payment_type,
            duration_months: mapped.payment_type === 'full' ? null : mapped.duration_months,
            contract_total: mapped.contract_total,
            start_date: mapped.start_date,
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
        showInstallmentFields,
        showPaymentSummary,
        paymentSummary,
        loadState,
    };
}
