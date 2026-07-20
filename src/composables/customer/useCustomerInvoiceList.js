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
    const invoices = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const first = ref(0);
    const rows = ref(10);

    const loadInvoices = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            invoices.value = cloneRows(response?.data?.data);
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load invoices.');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadInvoices);

    const onPage = (event) => {
        first.value = event.first;
        page.value = event.page + 1;
        loadInvoices();
    };

    const openInvoice = (id) => {
        router.push({ name: 'customerShowInvoice', params: { id } });
    };

    return {
        isLoading,
        invoices,
        totalRecords,
        first,
        rows,
        onPage,
        openInvoice,
    };
}
