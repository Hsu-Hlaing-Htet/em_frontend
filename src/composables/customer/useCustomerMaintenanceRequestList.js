import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
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
    const status = ref('');

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
                status: status.value || undefined,
            });
            const response = store.getAllResponse;
            const nextRows = cloneRows(response?.data?.data)
                .map((row) => ({
                    ...row,
                    status: row.customer_status
                        || (row.status === 'accepted' ? 'pending' : (row.status === 'rejected' ? 'cancelled' : row.status)),
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
        status,
        statusFilters,
        hasMore,
        loadMore,
        openRequest,
    };
}
