import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerInvoiceList() {
    const store = useCustomerInvoiceStore();
    const router = useRouter();
    const { t } = useI18n();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const invoices = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);
    const search = ref('');
    const status = ref('');
    let searchTimer = null;

    const statusFilters = computed(() => [
        { label: t('common.all'), value: '' },
        { label: t('common.open'), value: 'issued' },
        { label: t('common.partial'), value: 'partial' },
        { label: t('common.paid'), value: 'paid' },
        { label: t('common.overdue'), value: 'overdue' },
    ]);

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
        statusFilters,
        hasMore,
        loadMore,
        openInvoice,
    };
}
