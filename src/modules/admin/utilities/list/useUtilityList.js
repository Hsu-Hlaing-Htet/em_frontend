import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useUtilityStore } from '../store';

export const useUtilityList = () => {
    const dt = ref();
    const search = ref('');
    const statusFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const utilities = ref([]);
    const lazyParams = ref({});
    const store = useUtilityStore();
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
            multiSortMeta: [],
            first: 0,
        };
    };

    const showConfirmDialog = (id) => {
        confirmDelete('Are you sure you want to delete this utility record?', async () => {
            await store.delete({ id });
            await loadingData();
        });
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

        await store.fetchAll({
            page: lazyParams.value.page + 1,
            per_page: lazyParams.value.rows,
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            status: statusFilter.value || undefined,
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            utilities.value = data.data || [];
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
        statusFilter.value = null;
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
        utilities,
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
        showConfirmDialog,
    };
};
