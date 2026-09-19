import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { toQueryDate } from '@/helpers/lists/listQuery';
import { formatCurrencyAmount } from '@/utils/formatter';
import { usePaymentStore } from '../store';
import { useInvoiceStore } from '@/modules/admin/invoices/store';
import { usePaymentMethodStore } from '@/modules/admin/payment-methods/store';

function toWholeMmk(value) {
    return Math.round(Number(value));
}

function isWholeMmk(value) {
    const numeric = Number(value);

    return Number.isFinite(numeric) && Math.abs(numeric - Math.round(numeric)) < 0.000001;
}

export default function useNewPayment() {
    const store = usePaymentStore();
    const invoiceStore = useInvoiceStore();
    const paymentMethodStore = usePaymentMethodStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const paymentMethodOptions = ref([]);

    const invoiceContext = reactive({
        id: null,
        invoice_number: '',
        customer_name: '',
        room_number: '',
        building_name: '',
        amount_due: 0,
        remaining_balance: 0,
        status: '',
        payment_status: '',
        has_pending_payment: false,
    });

    const state = reactive({
        invoice_id: null,
        payment_method_id: null,
        amount: null,
        amount_received: null,
        note: '',
        payment_date: new Date(),
    });

    bindErrorClearing(state, errors);

    const amountDue = computed(() => {
        const remaining = Number(invoiceContext.remaining_balance);
        if (Number.isFinite(remaining) && remaining > 0) {
            return remaining;
        }

        const due = Number(invoiceContext.amount_due);
        return Number.isFinite(due) ? due : 0;
    });

    const refundAmount = computed(() => {
        const received = Number(state.amount_received);
        if (!Number.isFinite(received)) {
            return 0;
        }

        return Math.max(toWholeMmk(received) - toWholeMmk(amountDue.value), 0);
    });

    const roomLabel = computed(() => {
        const room = invoiceContext.room_number || '';
        const building = invoiceContext.building_name || '';

        if (building && room) {
            return `${building} · ${room}`;
        }

        return room || building || '—';
    });

    const canRecord = computed(() => {
        const status = String(invoiceContext.status || '').toLowerCase();
        const paymentStatus = String(invoiceContext.payment_status || '').toLowerCase();

        if (!invoiceContext.id || invoiceContext.has_pending_payment || amountDue.value <= 0) {
            return false;
        }

        if (['paid', 'draft', 'cancelled'].includes(status)) {
            return false;
        }

        return ['issued', 'overdue'].includes(status)
            || ['issued', 'overdue'].includes(paymentStatus);
    });

    const loadInvoiceContext = async (invoiceId) => {
        await invoiceStore.fetchOne({ id: invoiceId });
        const response = invoiceStore.getOneResponse;
        const invoice = response?.data;

        if (!invoice) {
            throw new Error('Invoice not found.');
        }

        Object.assign(invoiceContext, {
            id: invoice.id,
            invoice_number: invoice.invoice_number || '',
            customer_name: invoice.customer_name || '',
            room_number: invoice.room_number || '',
            building_name: invoice.building_name || '',
            amount_due: Number(invoice.amount_due ?? invoice.total_amount ?? 0),
            remaining_balance: Number(invoice.remaining_balance ?? invoice.amount_due ?? 0),
            status: invoice.status || '',
            payment_status: invoice.payment_status || '',
            has_pending_payment: Boolean(invoice.has_pending_payment),
        });

        state.invoice_id = invoice.id;
        state.amount = toWholeMmk(amountDue.value);
        state.amount_received = toWholeMmk(amountDue.value);
        state.payment_date = new Date();
    };

    onMounted(async () => {
        isLoading.value = true;

        try {
            const invoiceId = Number(route.query.invoice_id);

            if (!invoiceId) {
                EventBus.emit('show-toast', {
                    severity: 'warn',
                    summary: '',
                    detail: 'Open Pay from an unpaid invoice document.',
                });
                await router.replace({ name: 'invoiceList' });
                return;
            }

            await Promise.all([
                loadInvoiceContext(invoiceId),
                paymentMethodStore.fetchAll({ per_page: 100, status: 'active' }),
            ]);

            const methods = paymentMethodStore.getAllResponse;
            if (methods?.data?.data) {
                paymentMethodOptions.value = methods.data.data.map((method) => ({
                    label: method.name,
                    value: method.id,
                }));
            }

            if (!canRecord.value) {
                const detail = invoiceContext.has_pending_payment
                    ? 'This invoice already has a pending payment.'
                    : 'This invoice is not open for payment.';

                EventBus.emit('show-toast', {
                    severity: 'warn',
                    summary: '',
                    detail,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment form data.');
            await router.replace({ name: 'invoiceList' });
        } finally {
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!canRecord.value) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: invoiceContext.has_pending_payment
                    ? 'This invoice already has a pending payment.'
                    : 'This invoice is not open for payment.',
            });
            return;
        }

        state.amount = toWholeMmk(amountDue.value);

        if (!applyValidation(errors, state, [
            { field: 'invoice_id', type: 'select' },
            { field: 'payment_method_id', type: 'select' },
            { field: 'amount', type: 'number', gt: 0 },
            { field: 'amount_received', type: 'number', gt: 0 },
            { field: 'payment_date', type: 'date' },
        ])) {
            return;
        }

        if (!isWholeMmk(state.amount_received)) {
            errors.record({
                amount_received: ['Received amount must be a whole number (MMK).'],
            }, false);
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Received amount must be a whole number (MMK).',
            });
            return;
        }

        const received = toWholeMmk(state.amount_received);
        const due = toWholeMmk(amountDue.value);

        if (received < due) {
            const message = 'Received amount cannot be less than Amount Due.';
            // Field error only (notify=false) — avoid a second generic validation toast.
            errors.record({ amount_received: [message] }, false);
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: message,
            });
            return;
        }

        isSaving.value = true;

        try {
            await store.record({
                invoice_id: state.invoice_id,
                payment_method_id: state.payment_method_id,
                amount: due,
                amount_received: received,
                payment_date: toQueryDate(state.payment_date),
                note: state.note || null,
            });
            const response = store.getAddResponse;

            if (response?.data?.id) {
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
                await router.push({ name: 'invoiceDocument', params: { id: state.invoice_id } });
            }
        } catch (error) {
            if (error.status === 422) {
                const apiMessage = String(error.data?.message || '').trim();
                const fieldErrors = error.data?.data || error.data?.errors;

                if (fieldErrors) {
                    // Field errors already toast via Errors.record — do not double-toast.
                    errors.record(fieldErrors);
                } else if (apiMessage) {
                    const isReceivedValidation = /received amount/i.test(apiMessage);
                    if (isReceivedValidation) {
                        errors.record({ amount_received: [apiMessage] }, false);
                    }
                    EventBus.emit('show-toast', {
                        severity: 'warn',
                        summary: '',
                        detail: apiMessage,
                    });
                } else {
                    showApiErrorToast(error, 'Unable to pay invoice.');
                }
            } else {
                showApiErrorToast(error, 'Unable to pay invoice.');
            }
        } finally {
            isSaving.value = false;
        }
    };

    return {
        isLoading,
        isSaving,
        errors,
        state,
        invoiceContext,
        amountDue,
        refundAmount,
        roomLabel,
        canRecord,
        paymentMethodOptions,
        formatCurrencyAmount,
        handleSubmit,
    };
}
