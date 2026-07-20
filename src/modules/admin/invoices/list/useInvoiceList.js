import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { useInvoiceStore } from '../store';

const isApprovedStatus = (status) => status && status !== 'draft';

export const useInvoiceList = () => {
    const dt = ref();
    const search = ref('');
    const statusFilter = ref('all_approved');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const invoices = ref([]);
    const lazyParams = ref({});
    const store = useInvoiceStore();
    const errors = new Errors();

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            multiSortMeta: [],
            first: 0,
        };
    };

    const onPage = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = event.page;
        loadingData();
    };

    const onSort = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = 0;
        lazyParams.value.first = 0;
        loadingData();
    };

    const loadingData = async () => {
        isLoading.value = true;

        const params = {
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        };

        if (statusFilter.value && statusFilter.value !== 'all_approved') {
            params.status = statusFilter.value;
        }

        await store.fetchAll(params);

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            let rows = data.data || [];

            if (statusFilter.value === 'all_approved') {
                rows = rows.filter((invoice) => isApprovedStatus(invoice.status));
            }

            invoices.value = rows;
            totalRecords.value = statusFilter.value === 'all_approved'
                ? rows.length
                : response.data.total;
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
        statusFilter.value = 'all_approved';
        loadingData();
    };

    watch(
        [search, statusFilter],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 500),
    );

    return {
        invoices,
        errors,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        statusFilter,
        onSort,
        onPage,
        resetSearch,
    };
};
