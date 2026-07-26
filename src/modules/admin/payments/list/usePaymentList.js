import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { usePaymentStore } from '../store';

export const usePaymentList = () => {
    const dt = ref();
    const search = ref('');
    const billingStatusFilter = ref(null);
    const paymentTypeFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const payments = ref([]);
    const lazyParams = ref({});
    const store = usePaymentStore();
    const errors = new Errors();
    const { confirmDelete } = useDeleteConfirm();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            first: 0,
        };
    };

    const showConfirmDialog = (id) => {
        confirmDelete('Are you sure you want to delete this payment?', async () => {
            await store.delete({ id });
            await loadingData();
        });
    };

    const onPage = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = event.page;
        loadingData();
    };

    const loadingData = async () => {
        isLoading.value = true;

        await store.fetchAll({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            search: search.value,
            billing_status: billingStatusFilter.value || undefined,
            payment_type: paymentTypeFilter.value || undefined,
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            payments.value = data.data || [];
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
    };

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        billingStatusFilter.value = null;
        paymentTypeFilter.value = null;
        loadingData();
    };

    watch(
        [search, billingStatusFilter, paymentTypeFilter],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 500),
    );

    return {
        payments,
        errors,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        billingStatusFilter,
        paymentTypeFilter,
        onPage,
        resetSearch,
        showConfirmDialog,
    };
};
