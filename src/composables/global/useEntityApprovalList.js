import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';

const isWithinDateRange = (value, dateFrom, dateTo) => {
    if (!value) {
        return !dateFrom && !dateTo;
    }

    const date = new Date(value);

    if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);

        if (date < from) {
            return false;
        }
    }

    if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);

        if (date > to) {
            return false;
        }
    }

    return true;
};

export const useEntityApprovalList = ({
    store,
    pendingStatus,
    approveMethod = 'approve',
    rejectMethod = null,
    dateField = 'created_at',
    getItemLabel = (item) => String(item.id ?? ''),
    loadErrorMessage = 'Unable to load pending approvals.',
    approveErrorMessage = 'Unable to approve record.',
    rejectErrorMessage = 'Unable to reject record.',
    buildApproveSuccessMessage = (item, response) => response?.message || `${getItemLabel(item)} approved successfully.`,
    buildRejectSuccessMessage = (item, response) => response?.message || `${getItemLabel(item)} has been rejected.`,
}) => {
    const dt = ref();
    const search = ref('');
    const dateFrom = ref(null);
    const dateTo = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const items = ref([]);
    const lazyParams = ref({
        page: 0,
        rows: 10,
        multiSortMeta: [],
        first: 0,
    });

    const resetPagination = () => {
        lazyParams.value = {
            page: 0,
            rows: dt.value?.rows || 10,
            multiSortMeta: [],
            first: 0,
        };
    };

    const applyDateFilter = (rows) => rows.filter((row) => isWithinDateRange(row[dateField], dateFrom.value, dateTo.value));

    const loadingData = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta),
                search: search.value,
                status: pendingStatus,
            });

            const response = store.getAllResponse;

            if (response?.data) {
                items.value = applyDateFilter(response.data.data || []);
                totalRecords.value = response.data.total;
            } else {
                items.value = [];
                totalRecords.value = 0;
            }
        } catch (error) {
            items.value = [];
            totalRecords.value = 0;
            showApiErrorToast(error, loadErrorMessage);
        } finally {
            isLoading.value = false;
        }
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

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        dateFrom.value = null;
        dateTo.value = null;
        loadingData();
    };

    const approveItem = async (item) => {
        try {
            await store[approveMethod]({ id: item.id });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: buildApproveSuccessMessage(item, response),
            });

            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, approveErrorMessage);

            return false;
        }
    };

    const rejectItem = async (item, payload = {}) => {
        if (!rejectMethod) {
            return false;
        }

        try {
            await store[rejectMethod]({ id: item.id, ...payload });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: buildRejectSuccessMessage(item, response),
            });

            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, rejectErrorMessage);

            return false;
        }
    };

    onMounted(() => {
        resetPagination();
        loadingData();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    watch(
        [search, dateFrom, dateTo],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 300),
    );

    return {
        dt,
        search,
        dateFrom,
        dateTo,
        items,
        totalRecords,
        lazyParams,
        isLoading,
        onPage,
        onSort,
        resetSearch,
        approveItem,
        rejectItem,
        reload: loadingData,
    };
};
