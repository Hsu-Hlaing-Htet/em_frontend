import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerReceiptStore } from '@/modules/customer/receipts/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerReceiptList() {
    const store = useCustomerReceiptStore();
    const router = useRouter();
    const isLoading = ref(true);
    const receipts = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const first = ref(0);
    const rows = ref(10);

    const loadReceipts = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            receipts.value = cloneRows(response?.data?.data);
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load receipts.');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadReceipts);

    const onPage = (event) => {
        first.value = event.first;
        page.value = event.page + 1;
        loadReceipts();
    };

    const openReceipt = (id) => {
        router.push({ name: 'customerShowReceipt', params: { id } });
    };

    return {
        isLoading,
        receipts,
        totalRecords,
        first,
        rows,
        onPage,
        openReceipt,
    };
}
