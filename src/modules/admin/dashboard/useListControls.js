import { computed, reactive, watch } from 'vue';

function compareValues(a, b, sortKey) {
    const left = a[sortKey];
    const right = b[sortKey];

    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }

    return String(left ?? '').localeCompare(String(right ?? ''));
}

export function useListControls(sourceItems, options = {}) {
    const {
        searchKeys = [],
        statusKey = 'status',
        defaultSort = 'updated_at',
        defaultSortDir = 'desc',
        pageSize: initialPageSize = 5,
    } = options;

    const state = reactive({
        search: '',
        statusFilter: 'all',
        sortKey: defaultSort,
        sortDir: defaultSortDir,
        page: 1,
        pageSize: initialPageSize,
    });

    const filteredItems = computed(() => {
        let items = [...sourceItems.value];
        const query = state.search.trim().toLowerCase();

        if (query && searchKeys.length) {
            items = items.filter((item) => searchKeys.some((key) => (
                String(item[key] ?? '').toLowerCase().includes(query)
            )));
        }

        if (state.statusFilter !== 'all') {
            items = items.filter((item) => item[statusKey] === state.statusFilter);
        }

        items.sort((a, b) => {
            const result = compareValues(a, b, state.sortKey);

            return state.sortDir === 'asc' ? result : -result;
        });

        return items;
    });

    const totalCount = computed(() => filteredItems.value.length);
    const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / state.pageSize)));

    const paginatedItems = computed(() => {
        const start = (state.page - 1) * state.pageSize;

        return filteredItems.value.slice(start, start + state.pageSize);
    });

    const pageStart = computed(() => (totalCount.value === 0 ? 0 : (state.page - 1) * state.pageSize + 1));
    const pageEnd = computed(() => Math.min(state.page * state.pageSize, totalCount.value));
    const isEmpty = computed(() => !filteredItems.value.length);

    watch(
        () => [state.search, state.statusFilter, state.sortKey, state.sortDir, state.pageSize],
        () => {
            state.page = 1;
        },
    );

    watch(totalPages, (nextTotal) => {
        if (state.page > nextTotal) {
            state.page = nextTotal;
        }
    });

    function goToPage(nextPage) {
        state.page = Math.min(Math.max(1, nextPage), totalPages.value);
    }

    function toggleSortDir() {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    }

    function resetFilters() {
        state.search = '';
        state.statusFilter = 'all';
        state.sortKey = defaultSort;
        state.sortDir = defaultSortDir;
        state.page = 1;
    }

    return {
        state,
        filteredItems,
        paginatedItems,
        totalCount,
        totalPages,
        pageStart,
        pageEnd,
        isEmpty,
        goToPage,
        toggleSortDir,
        resetFilters,
    };
}
