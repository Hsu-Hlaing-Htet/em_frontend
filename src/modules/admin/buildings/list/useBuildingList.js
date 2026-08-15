import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useBuildingStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { BUILDING_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

export const useBuildingList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const buildings = ref([]);
    const selectedBuildings = ref([]);
    const lazyParams = ref({});
    const store = useBuildingStore();
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

    const clearSelection = () => {
        selectedBuildings.value = [];
    };

    const showConfirmDialog = (id, name) => {
        confirmDelete(`Are you sure you want to delete this ${name} building?`, async () => {
            await store.delete({ id });
            clearSelection();
            await loadingData();
        });
    };

    const showArchiveDialog = (building) => {
        const action = building.status === 'archived' ? 'reactivate' : 'archive';

        confirmDelete(`Are you sure you want to ${action} ${building.building_name}?`, async () => {
            await store[action === 'archive' ? 'archive' : 'activate']({ id: building.id });
            clearSelection();
            await loadingData();
        });
    };

    const canBulkDelete = computed(() => (
        selectedBuildings.value.length > 0
        && selectedBuildings.value.every((building) => building.can_delete === true)
    ));

    const showBulkDeleteConfirmDialog = () => {
        const ids = selectedBuildings.value.map((building) => building.id).filter(Boolean);

        if (!ids.length || !canBulkDelete.value) {
            return;
        }

        confirmDelete(`Are you sure you want to delete ${ids.length} selected buildings?`, async () => {
            await store.bulkDelete({ ids });
            clearSelection();
            await loadingData();
        });
    };

    const onPage = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = event.page;
        clearSelection();
        loadingData();
    };

    const onSort = (event) => {
        lazyParams.value = event;
        lazyParams.value.page = 0;
        lazyParams.value.first = 0;
        clearSelection();
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
            buildings.value = data.data || [];
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
        clearSelection();
        loadingData();
    };

    watch(
        [search],
        useDebounceFn(() => {
            resetPagination();
            clearSelection();
            loadingData();
        }, 500),
    );

    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Buildings',
        filenameBase: 'buildings',
        columns: BUILDING_EXPORT_COLUMNS,
        emptyMessage: 'No buildings available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);

            return store.getAllResponse;
        },
        mapItem: (item) => ({
            building_name: item.building_name,
            location: item.location,
            description: item.description || '',
            created_at: item.created_at,
        }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        buildings,
        selectedBuildings,
        selectedBuildingCount: computed(() => selectedBuildings.value.length),
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        onSort,
        onPage,
        resetSearch,
        showConfirmDialog,
        showArchiveDialog,
        showBulkDeleteConfirmDialog,
        canBulkDelete,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
