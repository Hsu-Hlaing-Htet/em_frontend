import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerPaymentStore } from '@/modules/customer/payments/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerPaymentList() {
    const store = useCustomerPaymentStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const payments = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);

    const hasMore = () => payments.value.length < totalRecords.value;

    const loadPayments = async ({ append = false } = {}) => {
        if (append) {
            isLoadingMore.value = true;
        } else {
            isLoading.value = true;
        }

        try {
            await store.fetchAll({
                page: page.value,
                per_page: rows.value,
            });
            const response = store.getAllResponse;
            const nextRows = cloneRows(response?.data?.data);
            payments.value = append ? [...payments.value, ...nextRows] : nextRows;
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payments.');
        } finally {
            isLoading.value = false;
            isLoadingMore.value = false;
        }
    };

    onMounted(() => {
        page.value = 1;
        loadPayments();
    });

    const loadMore = () => {
        if (!hasMore() || isLoadingMore.value) {
            return;
        }

        page.value += 1;
        loadPayments({ append: true });
    };

    const openPayment = (payment) => {
        if (payment.id) {
            router.push({ name: 'customerShowPayment', params: { id: payment.id } });
        }
    };

    const openReceipt = (receiptId) => {
        if (receiptId) {
            router.push({ name: 'customerShowReceipt', params: { id: receiptId } });
        }
    };

    return {
        isLoading,
        isLoadingMore,
        payments,
        totalRecords,
        hasMore,
        loadMore,
        openPayment,
        openReceipt,
    };
}
