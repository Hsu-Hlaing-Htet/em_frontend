import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { Errors } from '@/utils/validation';
import { formatCurrency } from '@/utils/formatter';
import { useBuildingStore } from '@/modules/admin/buildings/store';
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from '@/constants/constant';
import { useRoomStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { ROOM_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

export const useRoomList = () => {
    const dt = ref();
    const search = ref('');
    const selectedBuilding = ref(null);
    const selectedType = ref(null);
    const selectedStatus = ref(null);
    const buildingOptions = ref([]);
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const rooms = ref([]);
    const lazyParams = ref({});
    const store = useRoomStore();
    const buildingStore = useBuildingStore();
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

    const showConfirmDialog = (id,room_number) => {
        confirmDelete(`Are you sure you want to delete this ${room_number} room?`, async () => {
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
            building_id: selectedBuilding.value,
            type: selectedType.value,
            status: selectedStatus.value,
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            rooms.value = data.data || [];
            totalRecords.value = response.data.total;
        }

        isLoading.value = false;
    };

    onMounted(async () => {
        resetPagination();

        await buildingStore.fetchAll({ per_page: 100 });
        const buildingResponse = buildingStore.getAllResponse;

        if (buildingResponse?.data?.data) {
            buildingOptions.value = buildingResponse.data.data.map((building) => ({
                label: building.building_name,
                value: building.id,
            }));
        }

        loadingData();
    });

    const resetSearch = () => {
        resetPagination();
        search.value = '';
        selectedBuilding.value = null;
        selectedType.value = null;
        selectedStatus.value = null;
        loadingData();
    };

    watch(
        [search, selectedBuilding, selectedType, selectedStatus],
        useDebounceFn(() => {
            resetPagination();
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
        title: 'Rooms',
        filenameBase: 'rooms',
        columns: ROOM_EXPORT_COLUMNS,
        emptyMessage: 'No rooms available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
            building_id: selectedBuilding.value,
            type: selectedType.value,
            status: selectedStatus.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => ({
            building_name: item.building_name || item.building?.building_name || '',
            room_number: item.room_number,
            floor_number: item.floor_number,
            area_sqft: item.area_sqft,
            type: item.type,
            status: item.status,
            sale_price: item.sale_price,
            rent_price: item.rent_price,
            rent_deposit_price: item.rent_deposit_price,
            booking_deposit_price: item.booking_deposit_price,
        }),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
            { label: 'Building', value: buildingOptions.value.find((o) => o.value === selectedBuilding.value)?.label || '' },
            { label: 'Type', value: selectedType.value || '' },
            { label: 'Status', value: selectedStatus.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        rooms,
        errors,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        selectedBuilding,
        selectedType,
        selectedStatus,
        buildingOptions,
        typeOptions: ROOM_TYPE_OPTIONS,
        statusOptions: ROOM_STATUS_OPTIONS,
        onSort,
        onPage,
        resetSearch,
        showConfirmDialog,
        formatCurrency,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
