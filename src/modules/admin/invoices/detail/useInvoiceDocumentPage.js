import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useInvoiceStore } from '../store';
import { useLateFeeStore } from '@/modules/admin/late-fees/store';
import { useInvoiceDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { buildDocumentEmailRecipients } from '@/helpers/documents/buildDocumentEmailRecipients';
import {
    buildLateFeeRuleOptions,
    lateFeeSelectionFromInvoice,
} from '@/helpers/invoices/lateFeePolicyHelpers';
import { service } from '../service';

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    return [];
}

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export default function useInvoiceDocumentPage(options = {}) {
    const route = useRoute();
    const router = useRouter();
    const store = options.store || useInvoiceStore();
    const lateFeeStore = useLateFeeStore();
    const documentService = options.service || service;
    const isLoading = ref(true);
    const isApproving = ref(false);
    const isRejecting = ref(false);
    const isSavingLateFee = ref(false);
    const showApproveDialog = ref(false);
    const documentHtml = ref('');
    const lateFeeRuleOptions = ref([]);
    const lateFeeSelection = ref(null);
    const approvalRemark = ref('');
    const remarkError = ref('');

    const state = reactive({
        id: null,
        invoice_number: '',
        contract_id: null,
        type: '',
        issued_date: '',
        due_date: '',
        billing_period: '',
        late_fee: '',
        late_fee_selection: null,
        late_fee_policy: null,
        amount_due: '',
        overdue_days: 0,
        total_amount: '',
        paid_amount: 0,
        remaining_balance: 0,
        has_pending_payment: false,
        payment_status: '',
        notes: '',
        status: '',
        items: [],
        customer_name: '',
        customer_email: '',
        primary_customer_name: '',
        second_customer_name: '',
        second_customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_nrc: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
    });

    const {
        downloadPdf,
        exportPdf,
        printPdf,
        viewPdf,
        sendEmail: sendDocumentEmail,
    } = useInvoiceDocumentActions(state, () => documentHtml.value, documentService);

    const showSendEmailDialog = ref(false);
    const isSendingEmail = ref(false);
    const emailRecipients = computed(() => buildDocumentEmailRecipients(state));

    const openSendEmailDialog = async () => {
        await loadInvoice({ quiet: true });
        showSendEmailDialog.value = true;
    };

    const confirmSendEmail = async () => {
        if (isSendingEmail.value) {
            return;
        }

        isSendingEmail.value = true;

        try {
            await sendDocumentEmail();
            showSendEmailDialog.value = false;
        } finally {
            isSendingEmail.value = false;
        }
    };

    const backRoute = computed(() => {
        if (typeof options.resolveBackRoute === 'function') {
            return options.resolveBackRoute(state, route);
        }

        return route.meta.approvalContext
            ? { name: 'invoiceApprovalList' }
            : { name: 'invoiceList' };
    });

    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const normalizedStatus = computed(() => String(state.status || '').toLowerCase());
    const normalizedPaymentStatus = computed(() => String(state.payment_status || '').toLowerCase());
    const canApproveInvoice = computed(() => (
        isApprovalView.value && normalizedStatus.value === 'draft'
    ));
    const canRejectInvoice = computed(() => canApproveInvoice.value);
    const canDownloadInvoice = computed(() => !isApprovalView.value);
    const canSendInvoice = computed(() => (
        !isApprovalView.value && ['issued', 'overdue'].includes(normalizedStatus.value)
    ));

    const outstandingBalance = computed(() => {
        const remaining = Number(state.remaining_balance);
        if (Number.isFinite(remaining) && remaining > 0) {
            return remaining;
        }

        const due = Number(state.amount_due);
        const paid = Number(state.paid_amount || 0);
        if (Number.isFinite(due) && due - paid > 0.009) {
            return roundMoney(due - paid);
        }

        const computedDue = Number(state.total_amount || 0) + Number(state.late_fee || 0);
        if (Number.isFinite(computedDue) && computedDue - paid > 0.009) {
            return roundMoney(computedDue - paid);
        }

        return 0;
    });

    const canRecordPayment = computed(() => {
        const status = normalizedStatus.value;
        const paymentStatus = normalizedPaymentStatus.value;
        const isIssuedOrOverdue = ['issued', 'overdue'].includes(status)
            || ['issued', 'overdue'].includes(paymentStatus);

        return !isApprovalView.value
            && isIssuedOrOverdue
            && outstandingBalance.value > 0
            && !state.has_pending_payment
            && !['paid', 'draft', 'cancelled'].includes(status);
    });

    const goRecordPayment = () => {
        if (!canRecordPayment.value || !state.id) {
            return;
        }

        router.push({
            name: 'newPayment',
            query: { invoice_id: String(state.id) },
        });
    };

    const loadDocumentHtml = async (invoiceId) => {
        if (!invoiceId || typeof documentService.previewDocumentHtml !== 'function') {
            documentHtml.value = '';
            return;
        }

        documentHtml.value = await documentService.previewDocumentHtml({ id: invoiceId });
    };

    const applyInvoiceResponse = (data) => {
        Object.assign(state, data, {
            items: normalizeList(data.items || data.invoice_items || data.invoiceItems),
        });
        lateFeeSelection.value = lateFeeSelectionFromInvoice(data);
    };

    const loadLateFeeOptions = async () => {
        try {
            await lateFeeStore.fetchOptions();
            const response = lateFeeStore.getOptionsResponse;
            const rules = Array.isArray(response?.data) ? response.data : [];
            lateFeeRuleOptions.value = buildLateFeeRuleOptions(rules);
        } catch (error) {
            lateFeeRuleOptions.value = buildLateFeeRuleOptions([]);
            showApiErrorToast(error, 'Unable to load Late Fee Rules.');
        }
    };

    const loadInvoice = async ({ quiet = false } = {}) => {
        if (!quiet) {
            isLoading.value = true;
            documentHtml.value = '';
        }

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                applyInvoiceResponse(response.data);
                if (!quiet) {
                    await loadDocumentHtml(state.id);
                }
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoice document.');
        } finally {
            if (!quiet) {
                isLoading.value = false;
            }
        }
    };

    const onLateFeeSelectionChange = async (selection) => {
        if (!canApproveInvoice.value || !state.id || isSavingLateFee.value) {
            return;
        }

        const previous = lateFeeSelection.value;
        lateFeeSelection.value = selection;
        isSavingLateFee.value = true;

        try {
            await store.updateLateFeePolicy({
                id: state.id,
                late_fee_selection: selection,
            });
            const response = store.getActionResponse;
            if (response?.data) {
                applyInvoiceResponse(response.data);
                await loadDocumentHtml(state.id);
            }
        } catch (error) {
            lateFeeSelection.value = previous;
            showApiErrorToast(error, 'Unable to update Late Fee Rule.');
        } finally {
            isSavingLateFee.value = false;
        }
    };

    const requestApprove = () => {
        if (!canApproveInvoice.value || isApproving.value || isRejecting.value) {
            return;
        }

        remarkError.value = '';

        if (lateFeeSelection.value == null || lateFeeSelection.value === '') {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Please select a Late Fee Rule.',
            });
            return;
        }

        showApproveDialog.value = true;
    };

    const approveInvoice = async () => {
        if (!canApproveInvoice.value || isApproving.value) {
            return;
        }

        if (lateFeeSelection.value == null || lateFeeSelection.value === '') {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Please select a Late Fee Rule.',
            });
            showApproveDialog.value = false;
            return;
        }

        isApproving.value = true;

        try {
            await store.issue({
                id: state.id,
                late_fee_selection: lateFeeSelection.value,
            });
            const response = store.getActionResponse;

            if (response?.data) {
                applyInvoiceResponse(response.data);
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || 'Invoice issued successfully.',
            });

            showApproveDialog.value = false;

            await router.push({ name: 'invoiceList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to approve invoice.');
        } finally {
            isApproving.value = false;
        }
    };

    const requestReject = async () => {
        if (!canRejectInvoice.value || isRejecting.value || isApproving.value) {
            return;
        }

        const reason = approvalRemark.value.trim();

        if (!reason) {
            remarkError.value = 'Remark is required to reject.';
            return;
        }

        remarkError.value = '';
        await rejectInvoice(reason);
    };

    const rejectInvoice = async (reason) => {
        if (!canRejectInvoice.value || isRejecting.value) {
            return;
        }

        isRejecting.value = true;

        try {
            await store.delete({ id: state.id, rejection_reason: reason });
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Invoice rejected successfully.',
            });

            showApproveDialog.value = false;

            await router.push({ name: 'invoiceApprovalList' });
        } catch (error) {
            showApiErrorToast(error, 'Unable to reject invoice.');
        } finally {
            isRejecting.value = false;
        }
    };

    watch(approvalRemark, () => {
        if (remarkError.value) {
            remarkError.value = '';
        }
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            approvalRemark.value = '';
            remarkError.value = '';
            loadInvoice();
        }
    });

    onMounted(async () => {
        if (route.meta.approvalContext) {
            await loadLateFeeOptions();
        }
        await loadInvoice();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        isApprovalView,
        isApproving,
        isRejecting,
        isSavingLateFee,
        showApproveDialog,
        state,
        documentHtml,
        document: documentHtml,
        backRoute,
        canApproveInvoice,
        canRejectInvoice,
        canDownloadInvoice,
        canSendInvoice,
        canRecordPayment,
        goRecordPayment,
        lateFeeRuleOptions,
        lateFeeSelection,
        approvalRemark,
        remarkError,
        onLateFeeSelectionChange,
        requestApprove,
        requestReject,
        approveInvoice,
        rejectInvoice,
        downloadPdf,
        exportPdf,
        printPdf,
        viewPdf,
        printContract: printPdf,
        showSendEmailDialog,
        isSendingEmail,
        emailRecipients,
        openSendEmailDialog,
        confirmSendEmail,
    };
}
