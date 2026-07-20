<script setup>
import { computed, inject } from 'vue';
import DashboardListSection from '../components/DashboardListSection.vue';

const props = defineProps({
    sectionKey: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    adminRoute: {
        type: String,
        default: '',
    },
});

const dashboard = inject('dashboard');

const controls = computed(() => dashboard.controls[props.sectionKey]);
const statusOptions = computed(() => dashboard.statusFilterOptions[props.sectionKey] ?? ['all']);
const sortOptionsList = computed(() => dashboard.sortOptions[props.sectionKey] ?? []);
</script>

<template>
    <DashboardListSection
        :title="title"
        :subtitle="subtitle"
        :loading="dashboard.loading"
        :status-options="statusOptions"
        :sort-options="sortOptionsList"
        :search="controls.state.search"
        :status-filter="controls.state.statusFilter"
        :sort-key="controls.state.sortKey"
        :sort-dir="controls.state.sortDir"
        :page="controls.state.page"
        :page-size="controls.state.pageSize"
        :is-empty="controls.isEmpty"
        :total-count="controls.totalCount"
        :total-pages="controls.totalPages"
        :page-start="controls.pageStart"
        :page-end="controls.pageEnd"
        @update:search="controls.state.search = $event"
        @update:status-filter="controls.state.statusFilter = $event"
        @update:sort-key="controls.state.sortKey = $event"
        @update:page="controls.state.page = $event"
        @update:page-size="controls.state.pageSize = $event"
        @toggle-sort-dir="controls.toggleSortDir()"
        @reset-filters="controls.resetFilters()"
    >
        <div
            v-if="adminRoute"
            class="mb-4 flex justify-end"
        >
            <router-link
                :to="adminRoute"
                class="dashboard-control"
            >
                View all in admin
            </router-link>
        </div>

        <slot :items="controls.paginatedItems" />
    </DashboardListSection>
</template>
