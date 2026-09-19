import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { useInvoiceDocument } from '@/composables/admin/documents/useInvoiceDocument';
import { useInvoiceDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import {
    formatBillingPeriod,
    formatInvoiceNotes,
    formatInvoiceTypeLabel,
    formatPropertyUnit,
    resolveInvoicePaymentStatus,
} from '@/helpers/invoices/invoiceDetailHelpers';
import {
    buildInvoiceCustomerInfo,
    buildInvoiceSummaryNote,
} from '@/helpers/documents/renderInvoiceDocument';
import { formatBillingDocumentDate } from '@/helpers/billing/billingDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
import { useInvoiceStore } from '../store';
import { service } from '../service';

export default function useShowInvoice() {
    const store = useInvoiceStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isApproving = ref(false);
    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'invoiceApprovalList' }
            : { name: 'invoiceList' }
    ));

    const state = reactive({
        id: null,
        invoice_number: '',
        contract_id: null,
        utility_id: null,
        type: '',
        invoice_type: '',
        issued_date: '',
        due_date: '',
        billing_period: '',
        late_fee: '',
        amount_due: '',
        overdue_days: 0,
        total_amount: '',
        paid_amount: 0,
        remaining_balance: 0,
        has_pending_payment: false,
        payment_status: '',
        payment_method_name: '',
        notes: '',
        status: '',
        items: [],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        building_name: '',
        room_number: '',
        property_unit: '',
        created_by_name: '',
        approved_by: null,
        approved_at: '',
        created_at: '',
    });

    const { document } = useInvoiceDocument(state);
    const { downloadPdf, sendEmail } = useInvoiceDocumentActions(state, () => document.value, service);

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadInvoice();
        }
    });

    onMounted(() => {
        loadInvoice();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const loadInvoice = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                state.items = response.data.items || [];
            }
        } finally {
            isLoading.value = false;
        }
    };

    const handleApprove = async () => {
        isApproving.value = true;

        try {
            await store.issue({ id: state.id });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });

                if (isApprovalView.value) {
                    await router.push({ name: 'invoiceList' });
                }
            }
        } finally {
            isApproving.value = false;
        }
    };

    const canApprove = () => isApprovalView.value && state.status === 'draft';
    const canEdit = computed(() => state.status === 'draft' && !isApprovalView.value);
    const editRoute = computed(() => (
        state.id ? { name: 'showInvoiceApproval', params: { id: state.id } } : null
    ));
    const isApproved = computed(() => Boolean(state.approved_by?.id && state.approved_at));
    const formattedApprovedAt = computed(() => {
        if (!state.approved_at) {
            return '';
        }

        const normalized = state.approved_at.includes('T')
            ? state.approved_at
            : state.approved_at.replace(' ', 'T');

        return new Date(normalized).toLocaleString('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    });
    const formattedCreatedAt = computed(() => formatBillingDocumentDate(state.created_at));
    const documentRoute = computed(() => (
        state.id ? { name: 'invoiceDocument', params: { id: state.id } } : null
    ));
    const invoiceTypeLabel = computed(() => formatInvoiceTypeLabel(state.invoice_type || state.type));
    const propertyUnit = computed(() => formatPropertyUnit(state));
    const paymentStatus = computed(() => resolveInvoicePaymentStatus(state));
    const billingPeriod = computed(() => formatBillingPeriod(state));
    const invoiceNotes = computed(() => formatInvoiceNotes(state));
    const totalDue = computed(() => formatCurrency(
        Number(state.total_amount || 0) + Number(state.late_fee || 0),
    ));
    const paidAmount = computed(() => formatCurrency(state.paid_amount));
    const remainingBalance = computed(() => formatCurrency(state.remaining_balance));
    const invoiceAmount = computed(() => formatCurrency(state.total_amount));
    const customerLines = computed(() => buildInvoiceCustomerInfo(state).lines);
    const invoiceSummaryNote = computed(() => buildInvoiceSummaryNote(state));

    return {
        isApprovalView,
        backRoute,
        documentRoute,
        editRoute,
        isLoading,
        isApproving,
        state,
        handleApprove,
        canApprove,
        canEdit,
        isApproved,
        formattedApprovedAt,
        formattedCreatedAt,
        downloadPdf,
        sendEmail,
        invoiceTypeLabel,
        propertyUnit,
        paymentStatus,
        billingPeriod,
        invoiceNotes,
        totalDue,
        paidAmount,
        remainingBalance,
        invoiceAmount,
        customerLines,
        invoiceSummaryNote,
        formatCurrency,
    };
}
