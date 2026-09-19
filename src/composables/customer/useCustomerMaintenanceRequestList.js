import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

function formatListDate(value) {
    if (!value) {
        return '—';
    }

    const normalized = String(value).includes('T')
        ? value
        : String(value).replace(' ', 'T');
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function useCustomerMaintenanceRequestList() {
    const store = useCustomerMaintenanceRequestStore();
    const router = useRouter();
    const { t } = useI18n();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const requests = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);
    const search = ref('');
    const status = ref('');
    let searchTimer = null;

    const statusFilters = computed(() => [
        { label: t('common.all'), value: '' },
        { label: t('common.pending'), value: 'pending' },
        { label: t('common.inProgress'), value: 'in_progress' },
        { label: t('common.completed'), value: 'completed' },
        { label: t('common.cancelled'), value: 'cancelled' },
    ]);

    const hasMore = () => requests.value.length < totalRecords.value;

    const loadRequests = async ({ append = false } = {}) => {
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
            const nextRows = cloneRows(response?.data?.data)
                .map((row) => ({
                    ...row,
                    status: row.customer_status
                        || (row.status === 'accepted' ? 'pending' : (row.status === 'rejected' ? 'cancelled' : row.status)),
                    created_date: formatListDate(row.created_at),
                }));
            requests.value = append ? [...requests.value, ...nextRows] : nextRows;
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance requests.');
        } finally {
            isLoading.value = false;
            isLoadingMore.value = false;
        }
    };

    const resetAndLoad = () => {
        page.value = 1;
        loadRequests();
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
        loadRequests({ append: true });
    };

    const openRequest = (id) => {
        router.push({ name: 'customerShowMaintenanceRequest', params: { id } });
    };

    return {
        isLoading,
        isLoadingMore,
        requests,
        search,
        status,
        statusFilters,
        hasMore,
        loadMore,
        openRequest,
    };
}
