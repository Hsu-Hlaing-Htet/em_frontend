import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerReceiptStore } from '@/modules/customer/receipts/store';
import { showApiErrorToast } from '@/utils/apiError';
import { mapCustomerReceipt } from '@/helpers/customer/receipt';

export default function useCustomerReceiptList() {
    const store = useCustomerReceiptStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const downloadingReceiptId = ref(null);
    const receipts = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);

    const hasMore = () => receipts.value.length < totalRecords.value;

    const loadReceipts = async ({ append = false } = {}) => {
        if (append) {
            isLoadingMore.value = true;
        } else {
            isLoading.value = true;
        }

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            const nextRows = (response?.data?.data || []).map(mapCustomerReceipt);
            receipts.value = append ? [...receipts.value, ...nextRows] : nextRows;
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load receipts.');
        } finally {
            isLoading.value = false;
            isLoadingMore.value = false;
        }
    };

    onMounted(() => loadReceipts());

    const loadMore = () => {
        if (!hasMore() || isLoadingMore.value) {
            return;
        }

        page.value += 1;
        loadReceipts({ append: true });
    };

    const openReceipt = (id) => {
        router.push({ name: 'customerShowReceipt', params: { id } });
    };

    const downloadReceipt = async (receipt) => {
        downloadingReceiptId.value = receipt.id;

        try {
            await store.downloadDocument(receipt.id, `${receipt.receipt_number || 'receipt'}.pdf`);
        } catch (error) {
            showApiErrorToast(error, 'Unable to download receipt.');
        } finally {
            downloadingReceiptId.value = null;
        }
    };

    return {
        isLoading,
        isLoadingMore,
        downloadingReceiptId,
        receipts,
        hasMore,
        loadMore,
        openReceipt,
        downloadReceipt,
    };
}
