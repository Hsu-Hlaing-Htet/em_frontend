import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { buildFieldSections } from '@/utils/contractDocument';
import {
    downloadPdf,
    exportPdf,
    printContract,
    sendEmail,
} from '@/utils/saleContractPdf';
import { MOCK_PENDING_APPROVALS } from '../../mockData';
import { useContractDocument } from '../../useContractDocument';

export default function useShowSaleContractApproval() {
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const showRejectDialog = ref(false);

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
        start_date: '',
        billing_day: 0,
        remarks: '',
        status: '',
        submitted_by: '',
        submitted_at: '',
        created_by: '',
        created_at: '',
        timeline: [],
    });

    const { document } = useContractDocument(state, {
        showApproval: true,
    });

    const fieldSections = computed(() => buildFieldSections(document.value));
    const backRoute = { name: 'saleContractApprovalList' };

    const fetchContract = async () => {
        isLoading.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        const contract = MOCK_PENDING_APPROVALS.find((item) => item.id === Number(route.params.id));

        if (contract) {
            Object.assign(state, {
                ...contract,
                timeline: [
                    { label: 'Draft Created', date: contract.created_at, actor: contract.created_by },
                    { label: 'Submitted for Approval', date: contract.submitted_at, actor: contract.submitted_by },
                ],
            });
        }

        isLoading.value = false;
    };

    const approveContract = () => {
        EventBus.emit('show-toast', {
            severity: 'success',
            summary: '',
            detail: `${state.contract_no} approved and moved to Active Sales.`,
        });
        router.push({ name: 'activeSaleList' });
    };

    const openRejectDialog = () => {
        showRejectDialog.value = true;
    };

    const rejectContract = () => {
        EventBus.emit('show-toast', {
            severity: 'warn',
            summary: '',
            detail: `${state.contract_no} has been rejected.`,
        });
        router.push({ name: 'saleContractApprovalList' });
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
        showRejectDialog,
        backRoute,
        approveContract,
        openRejectDialog,
        rejectContract,
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    };
}
