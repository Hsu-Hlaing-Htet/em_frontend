import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import EventBus from '@/libs/AppEventBus';
import { usePaymentMethodStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';

export const usePaymentMethodList = () => {
    const dt = ref();
    const search = ref('');
    const statusFilter = ref(null);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const paymentMethods = ref([]);
    const lazyParams = ref({});
    const store = usePaymentMethodStore();
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
        confirmDelete('Are you sure you want to delete this payment method?', async () => {
            await store.delete({ id });
            await loadingData();
        });
    };

    const toggleStatus = async (item, active) => {
        const previousStatus = item.status;
        const newStatus = active ? 'active' : 'inactive';

        if (previousStatus === newStatus) {
            return;
        }

        item.status = newStatus;

        try {
            await store.update({
                id: item.id,
                name: item.name,
                status: newStatus,
            });
            const response = store.getUpdateResponse;

            if (response) {
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch {
            item.status = previousStatus;
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
            paymentMethods.value = data.data || [];
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
        paymentMethods,
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
        toggleStatus,
    };
};
