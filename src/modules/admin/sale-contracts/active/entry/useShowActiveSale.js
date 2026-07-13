import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { buildFieldSections } from '@/utils/contractDocument';
import {
    downloadPdf,
    exportPdf,
    printContract,
    sendEmail,
} from '@/utils/saleContractPdf';
import { MOCK_ACTIVE_SALES } from '../../mockData';
import { useContractDocument } from '../../useContractDocument';

export default function useShowActiveSale() {
    const route = useRoute();
    const isLoading = ref(true);
    const showCancelDialog = ref(false);

    const state = reactive({
        id: null,
        contract_no: '',
        customer_name: '',
        customer_nrc: '',
        customer_phone: '',
        customer_email: '',
        building_name: '',
        room_number: '',
        room_price: 0,
        deposit: 0,
        payment_plan: '',
        payment_type: '',
        duration_months: 0,
        contract_total: 0,
        paid_amount: 0,
        remaining_amount: 0,
        start_date: '',
        billing_day: 0,
        remarks: '',
        status: '',
        approved_by: '',
        approved_at: '',
        submitted_by: '',
        submitted_at: '',
        created_by: '',
        created_at: '',
        cancellation_reason: '',
        cancelled_at: '',
        timeline: [],
    });

    const { document } = useContractDocument(state, {
        showPayment: true,
        showApproval: true,
    });

    const fieldSections = computed(() => buildFieldSections(document.value));
    const canCancel = computed(() => state.status === 'active');
    const backRoute = { name: 'activeSaleList' };

    const fetchContract = async () => {
        isLoading.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        const contract = MOCK_ACTIVE_SALES.find((item) => item.id === Number(route.params.id));

        if (contract) {
            Object.assign(state, contract);
        }

        isLoading.value = false;
    };

    const openCancelDialog = () => {
        showCancelDialog.value = true;
    };

    const cancelContract = (reason) => {
        state.status = 'cancelled';
        state.cancellation_reason = reason;
        state.cancelled_at = new Date().toISOString().slice(0, 10);
        state.timeline = [
            ...state.timeline,
            { label: 'Cancelled', date: state.cancelled_at, actor: 'Current User' },
        ];

        EventBus.emit('show-toast', {
            severity: 'success',
            summary: '',
            detail: `${state.contract_no} has been cancelled.`,
        });
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchContract();
        }
    });

    onMounted(fetchContract);

    return {
        isLoading,
        document,
        fieldSections,
        canCancel,
        showCancelDialog,
        backRoute,
        openCancelDialog,
        cancelContract,
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    };
}
