import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerContractStore } from '@/modules/customer/contracts/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerContractList() {
    const store = useCustomerContractStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const contracts = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const rows = ref(10);

    const hasMore = () => contracts.value.length < totalRecords.value;

    const loadContracts = async ({ append = false } = {}) => {
        if (append) {
            isLoadingMore.value = true;
        } else {
            isLoading.value = true;
        }

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            const nextRows = cloneRows(response?.data?.data);
            contracts.value = append ? [...contracts.value, ...nextRows] : nextRows;
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load contracts.');
        } finally {
            isLoading.value = false;
            isLoadingMore.value = false;
        }
    };

    onMounted(() => loadContracts());

    const loadMore = () => {
        if (!hasMore() || isLoadingMore.value) {
            return;
        }

        page.value += 1;
        loadContracts({ append: true });
    };

    const openContract = (id) => {
        router.push({ name: 'customerShowContract', params: { id } });
    };

    return {
        isLoading,
        isLoadingMore,
        contracts,
        hasMore,
        loadMore,
        openContract,
    };
}
