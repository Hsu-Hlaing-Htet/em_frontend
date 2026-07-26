import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Open', value: 'issued' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
];

export default function useCustomerInvoiceList() {
    const store = useCustomerInvoiceStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const invoices = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);
    const search = ref('');
    const status = ref('');
    let searchTimer = null;

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
                search: search.value || undefined,
                status: status.value || undefined,
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

    const resetAndLoad = () => {
        page.value = 1;
        loadInvoices();
    };

    onMounted(resetAndLoad);

    watch(status, resetAndLoad);

    watch(search, () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(resetAndLoad, 300);
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
        search,
        status,
        statusFilters: STATUS_FILTERS,
        hasMore,
        loadMore,
        openInvoice,
    };
}
