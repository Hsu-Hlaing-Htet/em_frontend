import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { buildFieldSections } from '@/helpers/contracts/contractDocument';
import { showApiErrorToast } from '@/utils/apiError';
import { useRentStore } from '../store';
import { buildRentTimeline, mapRentFromApi } from '../mapRent';
import { useContractDocument } from '@/composables/admin/documents/useRentContractDocument';
import { useRentContractDocumentActions } from '@/composables/admin/contracts/contractDocumentActions';

export default function useShowRentContractApproval() {
    const router = useRouter();
    const route = useRoute();
    const store = useRentStore();
    const isLoading = ref(true);
    const isApproving = ref(false);
    const isRejecting = ref(false);
    const showApproveDialog = ref(false);
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
        viewContract,
    } = useRentContractDocumentActions('draft', state, () => document.value);

    const fieldSections = computed(() => buildFieldSections(document.value));
    const canReview = computed(() => state.status === 'pending');
    const backRoute = { name: 'rentContractApprovalList' };

    const fetchContract = async () => {
        isLoading.value = true;

        try {
            await store.fetchDraft({ id: route.params.id });
            const mapped = mapRentFromApi(store.getOneResponse?.data);

            if (mapped) {
                Object.assign(state, {
                    ...mapped,
                    timeline: buildRentTimeline(mapped),
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load rent approval detail.');
        } finally {
            isLoading.value = false;
        }
    };

    const approveContract = async () => {
        if (!canReview.value || isApproving.value || isRejecting.value) {
            return;
        }

        isApproving.value = true;

        try {
            await store.approve({ id: state.id });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || `${state.contract_no} approved and moved to Rent Contracts.`,
            });
            showApproveDialog.value = false;
            router.push({ name: 'activeRentList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to approve rent contract.');
        } finally {
            isApproving.value = false;
        }
    };

    const openRejectDialog = () => {
        if (canReview.value && !isApproving.value && !isRejecting.value) {
            showRejectDialog.value = true;
        }
    };

    const rejectContract = async (reason) => {
        if (!canReview.value || isRejecting.value || !reason?.trim()) {
            return;
        }

        isRejecting.value = true;

        try {
            await store.reject({
                id: state.id,
                rejection_reason: reason,
            });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: response?.message || 'Rent contract rejected successfully.',
            });
            showRejectDialog.value = false;
            router.push({ name: 'activeRentList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to reject rent contract.');
        } finally {
            isRejecting.value = false;
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
        isApproving,
        isRejecting,
        showApproveDialog,
        document,
        fieldSections,
        showRejectDialog,
        backRoute,
        canReview,
        approveContract,
        openRejectDialog,
        rejectContract,
        downloadPdf,
        exportPdf,
        printContract,
        viewContract,
    };
}
