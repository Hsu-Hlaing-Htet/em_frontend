<script setup>
import DashboardSkeleton from './DashboardSkeleton.vue';
import DashboardEmptyState from './DashboardEmptyState.vue';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    search: {
        type: String,
        default: '',
    },
    statusFilter: {
        type: String,
        default: 'all',
    },
    sortKey: {
        type: String,
        required: true,
    },
    sortDir: {
        type: String,
        default: 'desc',
    },
    page: {
        type: Number,
        default: 1,
    },
    pageSize: {
        type: Number,
        default: 5,
    },
    statusOptions: {
        type: Array,
        default: () => [],
    },
    sortOptions: {
        type: Array,
        default: () => [],
    },
    pageStart: {
        type: Number,
        default: 0,
    },
    pageEnd: {
        type: Number,
        default: 0,
    },
    totalCount: {
        type: Number,
        default: 0,
    },
    totalPages: {
        type: Number,
        default: 1,
    },
    isEmpty: {
        type: Boolean,
        default: false,
    },
    emptyTitle: {
        type: String,
        default: 'No records found',
    },
    emptyMessage: {
        type: String,
        default: 'Try adjusting your search or filter criteria.',
    },
    skeletonRows: {
        type: Number,
        default: 5,
    },
});

const emit = defineEmits([
    'update:search',
    'update:statusFilter',
    'update:sortKey',
    'update:sortDir',
    'update:page',
    'update:pageSize',
    'toggle-sort-dir',
    'reset-filters',
]);

function formatStatusLabel(value) {
    if (value === 'all') {
        return 'All statuses';
    }

    return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>

<template>
    <article class="dashboard-panel">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h2 class="m-0 text-base text-rosewood">
                    {{ title }}
                </h2>
                <p
                    v-if="subtitle"
                    class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]"
                >
                    {{ subtitle }}
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <input
                    :value="search"
                    type="search"
                    class="dashboard-search"
                    placeholder="Search..."
                    @input="emit('update:search', $event.target.value)"
                >

                <select
                    :value="statusFilter"
                    class="dashboard-select"
                    @change="emit('update:statusFilter', $event.target.value)"
                >
                    <option
                        v-for="option in statusOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ formatStatusLabel(option) }}
                    </option>
                </select>

                <select
                    :value="sortKey"
                    class="dashboard-select"
                    @change="emit('update:sortKey', $event.target.value)"
                >
                    <option
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        Sort: {{ option.label }}
                    </option>
                </select>

                <button
                    type="button"
                    class="dashboard-control"
                    @click="emit('toggle-sort-dir')"
                >
                    <i :class="sortDir === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down'" />
                </button>

                <button
                    type="button"
                    class="dashboard-control"
                    @click="emit('reset-filters')"
                >
                    Reset
                </button>
            </div>
        </div>

        <DashboardSkeleton
            v-if="loading"
            :rows="skeletonRows"
            :columns="1"
        />

        <DashboardEmptyState
            v-else-if="isEmpty"
            :title="emptyTitle"
            :message="emptyMessage"
        />

        <div v-else>
            <slot />

            <div class="dashboard-pagination">
                <span class="text-sm text-[var(--admin-text-muted)]">
                    Showing {{ pageStart }}-{{ pageEnd }} of {{ totalCount }}
                </span>

                <div class="flex items-center gap-2">
                    <select
                        :value="pageSize"
                        class="dashboard-select"
                        @change="emit('update:pageSize', Number($event.target.value))"
                    >
                        <option :value="5">
                            5 / page
                        </option>
                        <option :value="10">
                            10 / page
                        </option>
                    </select>

                    <button
                        type="button"
                        class="dashboard-control"
                        :disabled="page <= 1"
                        @click="emit('update:page', page - 1)"
                    >
                        Prev
                    </button>

                    <span class="text-sm text-[var(--admin-text-muted)]">
                        Page {{ page }} / {{ totalPages }}
                    </span>

                    <button
                        type="button"
                        class="dashboard-control"
                        :disabled="page >= totalPages"
                        @click="emit('update:page', page + 1)"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </article>
</template>

<style scoped>
.dashboard-select {
    border-radius: 9999px;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface-solid);
    padding: 0.55rem 0.9rem;
    font-size: 0.875rem;
    color: var(--admin-text);
    outline: none;
}

.dashboard-select:focus {
    border-color: rgba(122, 49, 73, 0.35);
}

.dashboard-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--admin-border);
}
</style>
