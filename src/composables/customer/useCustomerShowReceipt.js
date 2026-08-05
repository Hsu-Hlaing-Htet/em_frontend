import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { mapCustomerReceipt } from '@/helpers/customer/receipt';
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
        payment_amount: '',
        payment_date: '',
        payment_method_name: '',
        status: '',
        building_name: '',
        room_number: '',
        issued_at: '',
    });

    onMounted(loadReceipt);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    async function loadReceipt() {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const data = store.getOneResponse?.data;

            if (data) {
                Object.assign(state, mapCustomerReceipt(data));
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

    return { isLoading, isDownloading, state, downloadPdf };
}
