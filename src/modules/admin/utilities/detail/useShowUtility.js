import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { formatCurrency } from '@/utils/formatter';
import { formatBillingMonthLabel } from '@/helpers/documents/billingDocumentHelpers';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { formatUnitValue } from '../utils/utilityFormHelpers';
import { formatUtilitySummaryNote } from '../utils/utilityDetailHelpers';
import { buildUtilityCustomerLines } from '@/composables/admin/documents/useUtilityDocument';
import { useUtilityStore } from '../store';

export default function useShowUtility() {
    const store = useUtilityStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const workflowLoading = ref({ submit: false, approve: false, reject: false });

    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'utilityApprovalList' }
            : { name: 'utilityList' }
    ));

    const state = reactive({
        id: null,
        room_id: null,
        room_number: '',
        building_name: '',
        billing_month: '',
        total_amount: '',
        status: '',
        items: [],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        created_by_name: '',
        approved_by_name: '',
        created_at: '',
    });

    const loadUtility = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data, {
                    items: response.data.items || [],
                });
            }
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadUtility();
        }
    });

    onMounted(loadUtility);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const runWorkflow = async (action) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data, {
                    items: response.data.items || state.items,
                });
                EventBus.emit('show-toast', { severity: 'success', summary: '', detail: response.message });

                if (isApprovalView.value) {
                    if (action === 'approve') {
                        await router.push({ name: 'invoiceApprovalList' });
                    } else if (action === 'reject') {
                        await router.push({ name: 'utilityApprovalList' });
                    }
                }
            }
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    const canEdit = computed(() => !isApprovalView.value && state.status === 'draft');
    const canSubmit = () => !isApprovalView.value && state.status === 'draft';
    const canApprove = () => state.status === 'pending';
    const canReject = () => isApprovalView.value
        ? state.status === 'pending'
        : ['draft', 'pending'].includes(state.status);

    const editRoute = computed(() => (
        state.id ? { name: 'editUtility', params: { id: state.id } } : null
    ));

    const documentRoute = computed(() => (
        state.id ? { name: 'utilityDocument', params: { id: state.id } } : null
    ));

    const formattedBillingMonth = computed(() => formatBillingMonthLabel(state.billing_month));
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(state.created_at));
    const utilitySummaryNote = computed(() => formatUtilitySummaryNote({
        billingMonthLabel: formattedBillingMonth.value,
        createdAtLabel: formattedCreatedAt.value,
        createdByName: state.created_by_name,
        approvedByName: state.approved_by_name,
    }));
    const customerLines = computed(() => buildUtilityCustomerLines(state));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        editRoute,
        isLoading,
        state,
        workflowLoading,
        runWorkflow,
        canEdit,
        canSubmit,
        canApprove,
        canReject,
        formattedBillingMonth,
        formattedCreatedAt,
        utilitySummaryNote,
        customerLines,
        formatCurrency,
        formatUnitValue,
    };
}
