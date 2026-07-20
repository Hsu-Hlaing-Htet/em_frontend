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
    const contracts = ref([]);
    const totalRecords = ref(0);
    const page = ref(1);
    const first = ref(0);
    const rows = ref(10);

    const loadContracts = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({ page: page.value, per_page: rows.value });
            const response = store.getAllResponse;
            contracts.value = cloneRows(response?.data?.data);
            totalRecords.value = response?.data?.total || 0;
        } catch (error) {
            showApiErrorToast(error, 'Unable to load contracts.');
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadContracts);

    const onPage = (event) => {
        first.value = event.first;
        page.value = event.page + 1;
        loadContracts();
    };

    const openContract = (id) => {
        router.push({ name: 'customerShowContract', params: { id } });
    };

    return {
        isLoading,
        contracts,
        totalRecords,
        first,
        rows,
        onPage,
        openContract,
    };
}
