import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { mapCustomerReceipt } from '@/helpers/customer/receipt';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useCustomerReceiptStore } from '@/modules/customer/receipts/store';

export default function useCustomerShowReceipt() {
    const store = useCustomerReceiptStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isDownloading = ref(false);

    const state = reactive({
        id: null,
        receipt_number: '',
        invoice_number: '',
        billing_month: '',
        invoice_base_amount: 0,
        late_fee: 0,
        invoice_amount: 0,
        paid_amount: 0,
        balance: 0,
        payment_amount: '',
        payment_date: '',
        payment_method_name: '',
        payment_type: '',
        status: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        building_name: '',
        room_number: '',
        items: [],
        issued_at: '',
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const backRoute = computed(() => ({ name: 'customerReceiptList' }));

    async function loadReceipt() {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const data = store.getOneResponse?.data;

            if (data) {
                Object.assign(state, mapCustomerReceipt(data), {
                    items: data.items || [],
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load receipt.');
        } finally {
            isLoading.value = false;
        }
    }

    async function downloadPdf() {
        isDownloading.value = true;

        try {
            await store.downloadDocument(state.id, `${state.receipt_number || 'receipt'}.pdf`);
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Receipt document downloaded.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to download receipt document.');
        } finally {
            isDownloading.value = false;
        }
    }

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadReceipt();
        }
    });

    onMounted(loadReceipt);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        isDownloading,
        state,
        document,
        backRoute,
        downloadPdf,
    };
}
