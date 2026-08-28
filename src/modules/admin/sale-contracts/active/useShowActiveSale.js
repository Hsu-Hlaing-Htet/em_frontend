import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { buildFieldSections } from '@/helpers/contracts/contractDocument';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleStore } from '../store';
import { saleService } from '../service';
import { buildSaleTimeline, mapSaleFromApi } from '../mapSale';
import { useContractDocument } from '@/composables/admin/documents/useSaleContractDocument';
import { useSaleContractDocumentActions } from '@/composables/admin/contracts/contractDocumentActions';
import { renderContractDocumentPage } from '@/helpers/documents/documentOutput';

export default function useShowActiveSale() {
    const route = useRoute();
    const router = useRouter();
    const store = useSaleStore();
    const isLoading = ref(true);
    const showCancelDialog = ref(false);
    const showSendEmailDialog = ref(false);
    const isSendingEmail = ref(false);

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
        termination_reason: '',
        termination_date: '',
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
    } = useSaleContractDocumentActions('approved', state, () => document.value);

    const fieldSections = computed(() => buildFieldSections(document.value));
    const contractStatus = computed(() => state.status || '');
    const canCancel = computed(() => state.status === 'active');
    const backRoute = { name: 'activeSaleList' };

    const fetchContract = async () => {
        isLoading.value = true;

        try {
            await store.fetchApprovedOne({ id: route.params.id });
            const mapped = mapSaleFromApi(store.getOneResponse?.data);

            if (mapped) {
                Object.assign(state, {
                    ...mapped,
                    timeline: buildSaleTimeline(mapped),
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load active sale detail.');
        } finally {
            isLoading.value = false;
        }
    };

    const openCancelDialog = () => {
        showCancelDialog.value = true;
    };

    const openSendEmailDialog = () => {
        showSendEmailDialog.value = true;
    };

    const cancelContract = async (payload) => {
        try {
            await store.cancel({ id: state.id, ...payload });
            showCancelDialog.value = false;
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: store.getActionResponse?.message || 'Sale contract terminated successfully.',
            });
            await router.push(backRoute);
        } catch (error) {
            showApiErrorToast(error, 'Unable to terminate sale contract.');
        }
    };

    const sendEmail = async () => {
        const currentDocument = document.value;

        if (!state.id || !currentDocument || isSendingEmail.value) {
            return;
        }

        isSendingEmail.value = true;

        try {
            const response = await saleService.sendDocumentEmail('approved', state.id, {
                html: renderContractDocumentPage(currentDocument),
            });

            showSendEmailDialog.value = false;
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || `Contract sent successfully to ${state.customer_email}.`,
            });
        } catch {
            EventBus.emit('show-toast', {
                severity: 'error',
                summary: '',
                detail: 'Unable to send the contract. Please try again.',
            });
        } finally {
            isSendingEmail.value = false;
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
        state,
        contractStatus,
        document,
        fieldSections,
        canCancel,
        showCancelDialog,
        showSendEmailDialog,
        isSendingEmail,
        backRoute,
        openCancelDialog,
        openSendEmailDialog,
        cancelContract,
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    };
}
