import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { multisortConvert } from '@/utils/multisort';
import { useDebounceFn } from '@/utils/debounce';
import { useRoleStore } from '../store';
import { useDeleteConfirm } from '@/composables/global/useDeleteConfirm';
import { useListExport } from '@/composables/admin/useListExport';
import { ROLE_EXPORT_COLUMNS } from '@/helpers/lists/exportColumns';

const HIDDEN_ADMIN_ROLE_NAMES = new Set(['customer']);
const ROLE_LABELS = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    staff: 'Staff',
};

function formatRoleLabel(name) {
    return ROLE_LABELS[name] || name || '-';
}

function mapRoleForAdminList(role) {
    return {
        ...role,
        display_name: formatRoleLabel(role.name),
    };
}

function isVisibleAdminRole(role) {
    return !HIDDEN_ADMIN_ROLE_NAMES.has(String(role.name || '').toLowerCase());
}

export const useRoleList = () => {
    const dt = ref();
    const search = ref('');
    const totalRecords = ref(0);
    const isLoading = ref(false);
    const roles = ref([]);
    const lazyParams = ref({});
    const store = useRoleStore();
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
        confirmDelete('Are you sure you want to delete this role?', async () => {
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
        });

        const response = store.getAllResponse;

        if (response) {
            const { data } = response;
            const visibleRoles = (data.data || [])
                .filter(isVisibleAdminRole)
                .map(mapRoleForAdminList);

            roles.value = visibleRoles;
            totalRecords.value = Math.max((response.data.total || 0) - ((data.data || []).length - visibleRoles.length), visibleRoles.length);
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


    const {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    } = useListExport({
        title: 'Roles',
        filenameBase: 'roles',
        columns: ROLE_EXPORT_COLUMNS,
        emptyMessage: 'No roles available to export.',
        getFetchParams: () => ({
            order: multisortConvert(lazyParams.value.multiSortMeta),
            search: search.value,
        }),
        fetchPage: async (params) => {
            await store.fetchAll(params);
            return store.getAllResponse;
        },
        mapItem: (item) => {
            if (!isVisibleAdminRole(item)) {
                return null;
            }

            return {
                name: formatRoleLabel(item.name),
                created_at: item.created_at,
            };
        },
        applyFilters: (items) => items.filter(Boolean),
        getFilterSummary: () => [
            { label: 'Search', value: search.value || '' },
        ],
        hasData: computed(() => totalRecords.value > 0),
    });

    return {
        roles,
        isLoading,
        totalRecords,
        lazyParams,
        dt,
        search,
        onSort,
        onPage,
        resetSearch,
        showConfirmDialog,
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
};
