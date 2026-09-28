import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { omitEmptyParams } from '@/helpers/lists/listQuery';
import { useClickableListRow } from '@/composables/admin/useClickableListRow';
import { useContactInquiryStore } from '../store';

export const useContactInquiryList = () => {
    const dt = ref();
    const { onRowClick } = useClickableListRow('showContactInquiry');
    const search = ref('');
    const statusFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const inquiries = ref([]);
    const lazyParams = ref({});
    const store = useContactInquiryStore();

    const statusOptions = [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
    ];

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

    const buildFetchParams = (extra = {}) => omitEmptyParams({
        page: lazyParams.value.page + 1,
        per_page: lazyParams.value.rows,
        order: multisortConvert(lazyParams.value.multiSortMeta),
        search: search.value,
        status: statusFilter.value || undefined,
        ...extra,
    });

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

        await store.fetchAll(buildFetchParams());

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            inquiries.value = data.data || [];
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
        dt,
        search,
        statusFilter,
        statusOptions,
        totalRecords,
        isLoading,
        inquiries,
        lazyParams,
        onPage,
        onSort,
        onRowClick,
        resetSearch,
    };
};
