import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerPaymentStore } from '@/modules/customer/payments/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerPaymentList() {
    const store = useCustomerPaymentStore();
    const router = useRouter();
    const { t } = useI18n();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const payments = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);
    const search = ref('');
    const status = ref('');
    let searchTimer = null;

    const statusFilters = computed(() => [
        { label: t('common.all'), value: '' },
        { label: t('common.pending'), value: 'pending' },
        { label: t('common.approved'), value: 'approved' },
        { label: t('common.rejected'), value: 'rejected' },
    ]);

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
                search: search.value || undefined,
                status: status.value || undefined,
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

    const resetAndLoad = () => {
        page.value = 1;
        loadPayments();
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
        search,
        status,
        statusFilters,
        hasMore,
        loadMore,
        openPayment,
        openReceipt,
    };
}
