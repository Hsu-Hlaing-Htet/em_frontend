import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { usePaymentStore } from '../store';
import { useInvoiceStore } from '@/modules/admin/invoices/store';
import { usePaymentMethodStore } from '@/modules/admin/payment-methods/store';

export default function useNewPayment() {
    const store = usePaymentStore();
    const invoiceStore = useInvoiceStore();
    const paymentMethodStore = usePaymentMethodStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const invoiceOptions = ref([]);
    const paymentMethodOptions = ref([]);

    const state = reactive({
        invoice_id: null,
        payment_method_id: null,
        amount: null,
        note: '',
        payment_date: new Date(),
    });

    bindErrorClearing(state, errors);

    onMounted(async () => {
        try {
            await Promise.all([
                invoiceStore.fetchAll({ per_page: 100, status: 'issued' }),
                paymentMethodStore.fetchAll({ per_page: 100 }),
            ]);

            const invoices = invoiceStore.getAllResponse;
            if (invoices?.data?.data) {
                invoiceOptions.value = invoices.data.data.map((invoice) => ({
                    label: `${invoice.invoice_number} (${invoice.total_amount})`,
                    value: invoice.id,
                }));
            }

            const methods = paymentMethodStore.getAllResponse;
            if (methods?.data?.data) {
                paymentMethodOptions.value = methods.data.data.map((method) => ({
                    label: method.name,
                    value: method.id,
                }));
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment form data.');
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'invoice_id', type: 'select' },
            { field: 'payment_method_id', type: 'select' },
            { field: 'amount', type: 'number', gt: 0 },
            { field: 'payment_date', type: 'date' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response?.data?.id) {
                await router.push({ name: 'showPayment', params: { id: response.data.id } });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to save payment.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        errors,
        state,
        invoiceOptions,
        paymentMethodOptions,
        handleSubmit,
    };
}
