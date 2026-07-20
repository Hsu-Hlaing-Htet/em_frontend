import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { buildFieldSections } from '@/helpers/contracts/contractDocument';
import { showApiErrorToast } from '@/utils/apiError';
import { generateInvoiceForContract } from '@/composables/admin/contracts/generateInvoiceForContract';
import { useSaleStore } from '../store';
import { buildSaleTimeline, mapSaleFromApi } from '../mapSale';
import { useContractDocument } from '@/composables/admin/documents/useSaleContractDocument';
import { useSaleContractDocumentActions } from '@/composables/admin/contracts/contractDocumentActions';

export default function useShowSaleContractApproval() {
    const router = useRouter();
    const route = useRoute();
    const store = useSaleStore();
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
    const {
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    } = useSaleContractDocumentActions('draft', state, () => document.value);

    const fieldSections = computed(() => buildFieldSections(document.value));
    const backRoute = { name: 'saleContractApprovalList' };

    const fetchContract = async () => {
        isLoading.value = true;

        try {
            await store.fetchDraft({ id: route.params.id });
            const mapped = mapSaleFromApi(store.getOneResponse?.data);

            if (mapped) {
                Object.assign(state, {
                    ...mapped,
                    timeline: buildSaleTimeline(mapped),
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load sale approval detail.');
        } finally {
            isLoading.value = false;
        }
    };

    const approveContract = async () => {
        try {
            await store.approve({ id: state.id });

            const response = store.getActionResponse;
            const approvedContract = response?.data || { ...state, id: state.id, type: 'sale' };

            try {
                await generateInvoiceForContract(approvedContract);
            } catch (error) {
                showApiErrorToast(error, 'Contract approved, but invoice generation failed.');
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || `${state.contract_no} approved and moved to Active Sales.`,
            });
            router.push({ name: 'activeSaleList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to approve sale.');
        }
    };

    const openRejectDialog = () => {
        showRejectDialog.value = true;
    };

    const rejectContract = async (reason) => {
        try {
            await store.reject({
                id: state.id,
                rejection_reason: reason,
            });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: response?.message || `${state.contract_no} has been rejected.`,
            });
            router.push({ name: 'saleContractApprovalList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to reject sale.');
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchContract();
        }
    });

    onMounted(fetchContract);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

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
