import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { buildFieldSections } from '@/helpers/contracts/contractDocument';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentStore } from '../store';
import { buildRentTimeline, mapRentFromApi } from '../mapRent';
import { useContractDocument } from '@/composables/admin/documents/useRentContractDocument';
import { useRentContractDocumentActions } from '@/composables/admin/contracts/contractDocumentActions';

export default function useShowActiveRent() {
    const route = useRoute();
    const store = useRentStore();
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
    const {
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    } = useRentContractDocumentActions('active', state, () => document.value);

    const fieldSections = computed(() => buildFieldSections(document.value));
    const contractStatus = computed(() => state.status || '');
    const canCancel = computed(() => false);
    const backRoute = { name: 'activeRentList' };

    const fetchContract = async () => {
        isLoading.value = true;

        try {
            await store.fetchActiveOne({ id: route.params.id });
            const mapped = mapRentFromApi(store.getOneResponse?.data);

            if (mapped) {
                Object.assign(state, {
                    ...mapped,
                    timeline: buildRentTimeline(mapped),
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load active rent detail.');
        } finally {
            isLoading.value = false;
        }
    };

    const openCancelDialog = () => {
        showCancelDialog.value = true;
    };

    const cancelContract = () => {
        showCancelDialog.value = false;
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
        state,
        contractStatus,
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
