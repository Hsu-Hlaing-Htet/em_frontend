import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { omitEmptyParams } from '@/helpers/lists/listQuery';
import { useClickableListRow } from '@/composables/admin/useClickableListRow';

export const useEntityApprovalList = ({
    store,
    pendingStatus,
    pendingStatusKey = 'status',
    approveMethod = 'approve',
    rejectMethod = null,
    detailRouteName = null,
    getItemLabel = (item) => String(item.id ?? ''),
    loadErrorMessage = 'Unable to load pending approvals.',
    approveErrorMessage = 'Unable to approve record.',
    rejectErrorMessage = 'Unable to reject record.',
    buildApproveSuccessMessage = (item, response) => response?.message || `${getItemLabel(item)} approved successfully.`,
    buildRejectSuccessMessage = (item, response) => response?.message || `${getItemLabel(item)} has been rejected.`,
    buildFilterParams = () => ({}),
    mapItems = (rows) => rows,
    getWatchSources = () => [],
    resetFilters = () => {},
    autoLoad = true,
}) => {
    const dt = ref();
    const { onRowClick } = detailRouteName
        ? useClickableListRow(detailRouteName)
        : { onRowClick: undefined };
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const items = ref([]);
    const approvingIds = ref(new Set());
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

    const loadingData = async () => {
        isLoading.value = true;

        try {
            await store.fetchAll(omitEmptyParams({
                page: (lazyParams.value.page || 0) + 1,
                per_page: lazyParams.value.rows || 10,
                order: multisortConvert(lazyParams.value.multiSortMeta) || undefined,
                search: search.value?.trim() || undefined,
                ...buildFilterParams(),
                [pendingStatusKey]: pendingStatus,
            }));

            const response = store.getAllResponse;

            if (response?.data) {
                items.value = mapItems(response.data.data || []);
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
        resetFilters();
        loadingData();
    };

    const removeItemFromList = (itemId) => {
        const previousLength = items.value.length;
        items.value = items.value.filter((row) => row.id !== itemId);

        if (items.value.length < previousLength) {
            totalRecords.value = Math.max(0, totalRecords.value - 1);
        }
    };

    const approveItem = async (item) => {
        if (!item?.id || approvingIds.value.has(item.id)) {
            return false;
        }

        approvingIds.value.add(item.id);

        try {
            await store[approveMethod]({ id: item.id });

            const response = store.getActionResponse;

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: buildApproveSuccessMessage(item, response),
            });

            removeItemFromList(item.id);
            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, approveErrorMessage);

            return false;
        } finally {
            approvingIds.value.delete(item.id);
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

            removeItemFromList(item.id);
            await loadingData();

            return true;
        } catch (error) {
            showApiErrorToast(error, rejectErrorMessage);

            return false;
        }
    };

    onMounted(() => {
        resetPagination();

        if (autoLoad) {
            loadingData();
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    watch(
        [search, ...getWatchSources()],
        useDebounceFn(() => {
            resetPagination();
            loadingData();
        }, 500),
    );

    return {
        dt,
        search,
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
        loadingData,
        resetPagination,
        onRowClick,
    };
};
