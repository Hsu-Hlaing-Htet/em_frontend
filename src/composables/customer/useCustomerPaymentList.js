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
    const payments = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const first = ref(0);
    const rows = ref(10);

    const loadPayments = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            payments.value = cloneRows(response?.data?.data);
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payments.');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadPayments);

    const onPage = (event) => {
        first.value = event.first;
        page.value = event.page + 1;
        loadPayments();
    };

    const openInvoice = (invoiceId) => {
        if (invoiceId) {
            router.push({ name: 'customerShowInvoice', params: { id: invoiceId } });
        }
    };

    const openReceipt = (receiptId) => {
        if (receiptId) {
            router.push({ name: 'customerShowReceipt', params: { id: receiptId } });
        }
    };

    return {
        isLoading,
        payments,
        totalRecords,
        first,
        rows,
        onPage,
        openInvoice,
        openReceipt,
    };
}
