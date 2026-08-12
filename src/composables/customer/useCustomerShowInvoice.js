import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { formatDate, formatCurrency } from '@/utils/formatter';
import { formatBillingDocumentDate, compactBillingValues } from '@/helpers/billing/billingDetailHelpers';
import { showApiErrorToast } from '@/utils/apiError';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { useCustomerPaymentStore } from '@/modules/customer/payments/store';
import { service } from '@/modules/customer/service';

export default function useCustomerShowInvoice() {
    const store = useCustomerInvoiceStore();
    const paymentStore = useCustomerPaymentStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const isDownloading = ref(false);
    const errors = new Errors();
    const paymentMethods = ref([]);
    const proofFile = ref(null);

    const invoiceItems = ref([]);
    const invoicePayments = ref([]);

    const state = reactive({
        id: null,
        invoice_number: '',
        type: '',
        issued_date: '',
        due_date: '',
        total_amount: 0,
        paid_amount: 0,
        status: '',
        building_name: '',
        room_number: '',
    });

    const paymentForm = reactive({
        payment_method_id: null,
        payment_date: new Date(),
        note: '',
    });

    const remainingAmount = computed(() => {
        return Math.max(Number(state.total_amount || 0) - Number(state.paid_amount || 0), 0);
    });

    const customerLines = computed(() => compactBillingValues([
        state.building_name,
        state.room_number,
        state.due_date,
    ]));

    const detailDate = computed(() => formatBillingDocumentDate(state.issued_date));

    const invoiceSummaryNote = computed(() => {
        if (!canPay.value) {
            return '';
        }

        return `Remaining balance ${formatCurrency(remainingAmount.value)}.`;
    });

    const canPay = computed(() => {
        return ['issued', 'partial', 'overdue', 'unpaid'].includes(state.status) && remainingAmount.value > 0;
    });

    onMounted(async () => {
        await Promise.all([loadInvoice(), loadPaymentMethods()]);
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadInvoice();
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    async function loadPaymentMethods() {
        try {
            const response = await service.getPaymentMethods();
            paymentMethods.value = (response?.data || []).map((method) => ({
                label: method.name,
                value: method.id,
            }));
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment methods.');
        }
    }

    async function loadInvoice() {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const data = store.getOneResponse?.data;

            if (data) {
                Object.assign(state, {
                    id: data.id,
                    invoice_number: data.invoice_number || '',
                    type: data.type || '',
                    issued_date: data.issued_date || '',
                    due_date: data.due_date || '',
                    total_amount: data.total_amount ?? 0,
                    paid_amount: data.paid_amount ?? 0,
                    status: data.status || '',
                    building_name: data.building_name || '',
                    room_number: data.room_number || '',
                });
                invoiceItems.value = Array.isArray(data.items)
                    ? data.items.map((item) => ({ ...item }))
                    : [];
                invoicePayments.value = Array.isArray(data.payments)
                    ? data.payments.map((payment) => ({ ...payment }))
                    : [];
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoice.');
        } finally {
            isLoading.value = false;
        }
    }

    async function submitPayment() {
        errors.clear();
        const validationErrors = {};

        if (!paymentForm.payment_method_id) {
            validationErrors.payment_method_id = ['This field is required.'];
        }

        if (!paymentForm.payment_date) {
            validationErrors.payment_date = ['This field is required.'];
        }

        if (!proofFile.value) {
            validationErrors.proof = ['This field is required.'];
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
            return;
        }

        isSaving.value = true;

        try {
            await paymentStore.submitPayment({
                invoice_id: state.id,
                payment_method_id: paymentForm.payment_method_id,
                payment_date: formatDate(paymentForm.payment_date),
                note: paymentForm.note,
                proof: proofFile.value,
            });

            const response = paymentStore.getSubmitResponse;

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || 'Payment submitted successfully.',
            });

            proofFile.value = null;
            await loadInvoice();
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
                return;
            }
            showApiErrorToast(error, 'Unable to submit payment.');
        } finally {
            isSaving.value = false;
        }
    }

    async function downloadPdf() {
        isDownloading.value = true;

        try {
            await store.downloadDocument(state.id, `${state.invoice_number || 'invoice'}.pdf`);
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Invoice document downloaded.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to download invoice document.');
        } finally {
            isDownloading.value = false;
        }
    }

    const onProofSelected = (event) => {
        proofFile.value = event.files?.[0] || null;
    };

    return {
        isLoading,
        isSaving,
        isDownloading,
        errors,
        state,
        invoiceItems,
        invoicePayments,
        paymentForm,
        paymentMethods,
        remainingAmount,
        canPay,
        customerLines,
        detailDate,
        invoiceSummaryNote,
        submitPayment,
        downloadPdf,
        onProofSelected,
    };
}
