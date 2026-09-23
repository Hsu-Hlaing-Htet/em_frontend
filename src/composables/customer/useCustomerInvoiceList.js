import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerInvoiceList() {
    const store = useCustomerInvoiceStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const invoices = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);

    const hasMore = () => invoices.value.length < totalRecords.value;

    const loadInvoices = async ({ append = false } = {}) => {
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
            invoices.value = append ? [...invoices.value, ...nextRows] : nextRows;
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoices.');
        } finally {
            isLoading.value = false;
            isLoadingMore.value = false;
        }
    };

    onMounted(() => {
        page.value = 1;
        loadInvoices();
    });

    const loadMore = () => {
        if (!hasMore() || isLoadingMore.value) {
            return;
        }

        page.value += 1;
        loadInvoices({ append: true });
    };

    const openInvoice = (id) => {
        router.push({ name: 'customerShowInvoice', params: { id } });
    };

    return {
        isLoading,
        isLoadingMore,
        invoices,
        hasMore,
        loadMore,
        openInvoice,
    };
}
