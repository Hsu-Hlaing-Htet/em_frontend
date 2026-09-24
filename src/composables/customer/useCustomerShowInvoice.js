import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { formatDate, formatCurrency } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { useCustomerPaymentStore } from '@/modules/customer/payments/store';
import { service } from '@/modules/customer/service';

export default function useCustomerShowInvoice() {
    const store = useCustomerInvoiceStore();
    const paymentStore = useCustomerPaymentStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const isDownloading = ref(false);
    const errors = new Errors();
    const paymentMethods = ref([]);
    const proofFile = ref(null);
    const proofPreviewUrl = ref('');
    const copiedField = ref('');
    let copyResetTimer = null;

    const invoiceItems = ref([]);
    const invoicePayments = ref([]);
    const documentHtml = ref('');

    const state = reactive({
        id: null,
        invoice_number: '',
        type: '',
        issued_date: '',
        due_date: '',
        billing_period: '',
        total_amount: 0,
        amount_due: 0,
        late_fee: 0,
        overdue_days: 0,
        paid_amount: 0,
        remaining_balance: null,
        has_pending_payment: false,
        pending_payment_id: null,
        status: '',
        building_name: '',
        room_number: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        items: [],
    });

    const paymentForm = reactive({
        amount: null,
        payment_method_id: null,
        payment_date: new Date(),
        reference_number: '',
        note: '',
    });

    bindErrorClearing(paymentForm, errors);

    watch(proofFile, () => {
        if (errors.has('proof')) {
            errors.clear('proof');
        }
    });

    const remainingAmount = computed(() => {
        if (state.remaining_balance !== null && state.remaining_balance !== undefined) {
            return Math.max(Number(state.remaining_balance || 0), 0);
        }

        const due = Number(state.amount_due || 0)
            || (Number(state.total_amount || 0) + Number(state.late_fee || 0));

        return Math.max(due - Number(state.paid_amount || 0), 0);
    });

    const canPay = computed(() => {
        return ['issued', 'partial', 'overdue', 'unpaid'].includes(String(state.status || '').toLowerCase())
            && remainingAmount.value > 0
            && !state.has_pending_payment;
    });

    const selectedPaymentMethod = computed(() => {
        if (!paymentForm.payment_method_id) {
            return null;
        }

        return paymentMethods.value.find((method) => method.value === paymentForm.payment_method_id) || null;
    });

    const formattedAmountDue = computed(() => formatCurrency(remainingAmount.value));
    const hasPendingPayment = computed(() => Boolean(state.has_pending_payment));
    const invoiceDocumentRoute = computed(() => (
        state.id ? { name: 'customerInvoiceDocument', params: { id: state.id } } : { name: 'customerInvoiceList' }
    ));
    const latestRejectedPayment = computed(() => normalizeList(invoicePayments.value)
        .filter((payment) => String(payment.status || '').toLowerCase() === 'rejected')
        .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0] || null);
    const rejectionReason = computed(() => latestRejectedPayment.value?.rejection_reason || '');
    const paymentUnavailableMessage = computed(() => {
        if (hasPendingPayment.value) {
            return 'A payment for this invoice is already pending review.';
        }

        if (String(state.status || '').toLowerCase() === 'paid') {
            return 'This invoice has already been paid.';
        }

        if (!canPay.value) {
            return 'This invoice is not open for payment.';
        }

        return '';
    });

    onMounted(async () => {
        await Promise.all([loadInvoice(), loadPaymentMethods()]);
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadInvoice();
        }
    });

    watch(() => route.hash, () => {
        scrollToPaymentFormIfRequested();
    });

    onBeforeUnmount(() => {
        if (copyResetTimer) {
            clearTimeout(copyResetTimer);
        }
        clearProofFile();
        store.$reset();
        store.$dispose();
    });

    async function copyField(fieldKey, value) {
        if (!value || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(String(value));
            copiedField.value = fieldKey;
            if (copyResetTimer) {
                clearTimeout(copyResetTimer);
            }
            copyResetTimer = setTimeout(() => {
                copiedField.value = '';
            }, 1600);
        } catch {
            copiedField.value = '';
        }
    }

    async function loadPaymentMethods() {
        try {
            const response = await service.getPaymentMethods();
            paymentMethods.value = (response?.data || []).map((method) => ({
                id: method.id,
                label: method.name,
                value: method.id,
                name: method.name,
                type: method.type || '',
                account_name: method.account_name || null,
                account_number: method.account_number || null,
                phone_number: method.phone_number || null,
                qr_image_url: method.qr_image_url || null,
                instructions: method.instructions || null,
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
                    billing_period: data.billing_period || '',
                    total_amount: data.total_amount ?? 0,
                    amount_due: data.amount_due ?? data.remaining_balance ?? data.total_amount ?? 0,
                    late_fee: data.late_fee ?? 0,
                    overdue_days: data.overdue_days ?? 0,
                    paid_amount: data.paid_amount ?? 0,
                    remaining_balance: data.remaining_balance ?? null,
                    has_pending_payment: Boolean(data.has_pending_payment),
                    pending_payment_id: data.pending_payment_id ?? null,
                    status: data.status || '',
                    building_name: data.building_name || '',
                    room_number: data.room_number || '',
                    customer_name: data.customer_name || '',
                    customer_email: data.customer_email || '',
                    customer_phone: data.customer_phone || '',
                });

                paymentForm.amount = remainingAmount.value || null;

                // Backend InvoiceResource field is `items` (may be wrapped as { data: [] }).
                const rawItems = data.items ?? data.invoice_items ?? data.invoiceItems;
                invoiceItems.value = normalizeList(rawItems).map((item) => ({ ...item }));
                invoicePayments.value = normalizeList(data.payments).map((payment) => ({ ...payment }));
                state.items = invoiceItems.value;

                try {
                    documentHtml.value = await service.previewInvoiceDocumentHtml(state.id);
                } catch (previewError) {
                    documentHtml.value = '';
                    showApiErrorToast(previewError, 'Unable to load invoice document preview.');
                }
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoice.');
        } finally {
            isLoading.value = false;
            await scrollToPaymentFormIfRequested();
        }
    }

    async function submitPayment() {
        errors.clear();

        if (!applyValidation(errors, {
            payment_method_id: paymentForm.payment_method_id,
            payment_date: paymentForm.payment_date,
            proof: proofFile.value,
        }, [
            { field: 'payment_method_id', type: 'select' },
            { field: 'payment_date', type: 'date' },
            { field: 'proof', type: 'file' },
        ])) {
            return;
        }

        isSaving.value = true;

        try {
            await paymentStore.submitPayment({
                invoice_id: state.id,
                payment_method_id: paymentForm.payment_method_id,
                payment_date: formatDate(paymentForm.payment_date),
                note: buildPaymentNote(),
                proof: proofFile.value,
            });

            const response = paymentStore.getSubmitResponse;

            await router.push({ name: 'customerPaymentList' });

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || 'Payment submitted successfully.',
            });

            clearProofFile();
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data?.data || error.data?.errors || {});
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

    async function goToPaymentForm() {
        await router.replace({ hash: '#make-payment' });
        await scrollToPaymentFormIfRequested();
    }

    const onProofSelected = (event) => {
        const file = event.files?.[0] || null;
        clearProofFile();

        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            errors.record({ proof: ['Please upload a JPG, JPEG, or PNG image.'] });
            return;
        }

        if (file.size > 5120 * 1024) {
            errors.record({ proof: ['Payment proof must not be larger than 5 MB.'] });
            return;
        }

        proofFile.value = file;
        proofPreviewUrl.value = URL.createObjectURL(file);
    };

    const clearProofFile = () => {
        if (proofPreviewUrl.value) {
            URL.revokeObjectURL(proofPreviewUrl.value);
        }

        proofFile.value = null;
        proofPreviewUrl.value = '';
    };

    const buildPaymentNote = () => [
        paymentForm.note || '',
    ].filter(Boolean).join('\n');

    async function scrollToPaymentFormIfRequested() {
        if (route.hash !== '#make-payment') {
            return;
        }

        await nextTick();
        document.getElementById('make-payment')?.scrollIntoView({ block: 'start' });
    }

    function normalizeList(value) {
        if (Array.isArray(value)) {
            return value;
        }

        if (value && Array.isArray(value.data)) {
            return value.data;
        }

        return [];
    }

    return {
        isLoading,
        isSaving,
        isDownloading,
        errors,
        state,
        documentHtml,
        invoiceItems,
        invoicePayments,
        paymentForm,
        paymentMethods,
        selectedPaymentMethod,
        copiedField,
        proofFile,
        proofPreviewUrl,
        remainingAmount,
        formattedAmountDue,
        canPay,
        hasPendingPayment,
        invoiceDocumentRoute,
        rejectionReason,
        paymentUnavailableMessage,
        submitPayment,
        downloadPdf,
        goToPaymentForm,
        onProofSelected,
        clearProofFile,
        copyField,
    };
}
