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
    const requests = ref([]);
    const status = ref('');

    // Load the full customer list in one request so the UI does not need a
    // "Load more" control (same high per_page approach as customer dashboard).
    const perPage = 1000;

    const statusFilters = computed(() => [
        { label: t('common.all'), value: '' },
        { label: t('common.pending'), value: 'pending' },
        { label: t('common.inProgress'), value: 'in_progress' },
        { label: t('common.completed'), value: 'completed' },
        { label: t('common.cancelled'), value: 'cancelled' },
    ]);

    const loadRequests = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({
                page: 1,
                per_page: perPage,
                status: status.value || undefined,
            });
            const response = store.getAllResponse;
            requests.value = cloneRows(response?.data?.data)
                .map((row) => ({
                    ...row,
                    status: row.customer_status
                        || (row.status === 'accepted' ? 'pending' : (row.status === 'rejected' ? 'cancelled' : row.status)),
                }));
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance requests.');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadRequests);

    watch(status, loadRequests);

    const openRequest = (id) => {
        router.push({ name: 'customerShowMaintenanceRequest', params: { id } });
    };

    return {
        isLoading,
        requests,
        status,
        statusFilters,
        openRequest,
    };
}
