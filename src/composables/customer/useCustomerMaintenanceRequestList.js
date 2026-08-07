import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
];

export default function useCustomerMaintenanceRequestList() {
    const store = useCustomerMaintenanceRequestStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const requests = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);
    const search = ref('');
    const status = ref('');
    let searchTimer = null;

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
            const nextRows = cloneRows(response?.data?.data);
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
        statusFilters: STATUS_FILTERS,
        hasMore,
        loadMore,
        openRequest,
    };
}
