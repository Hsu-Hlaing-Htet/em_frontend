import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { useUtilityTypeStore } from '../store';

export const useUtilityTypeList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const utilityTypes = ref([]);
    const lazyParams = ref({});
    const store = useUtilityTypeStore();
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

    const showConfirmDialog = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this utility type?',
        );

        if (!confirmed) {
            return;
        }

        await store.delete({ id });
        await loadingData();
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
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            utilityTypes.value = data.data || [];
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
        loadingData();
    };

    watch(
        [search],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 500),
    );

    return {
        utilityTypes,
        errors,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        onSort,
        onPage,
        resetSearch,
        showConfirmDialog,
    };
};
