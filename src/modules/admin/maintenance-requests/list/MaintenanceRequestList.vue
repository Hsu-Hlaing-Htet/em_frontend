<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative">
            <DataTable
                ref="dt"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                sort-mode="multiple"
                scroll-height="50vh"
                :scrollable="true"
                :lazy="true"
                :paginator="true"
                :value="maintenanceRequests"
                :multi-sort-meta="lazyParams.multiSortMeta"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                removable-sort
                row-hover
                class="admin-clickable-rows"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="All Maintenance Requests"
                        :search="search"
                        search-placeholder="Search resident, title, room, or category..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="priorityFilter"
                            :options="priorityOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Priority"
                            show-clear
                            class="w-36"
                        />
                        <Dropdown
                            v-model="statusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Status"
                            show-clear
                            class="w-40"
                        />
                        <div class="admin-filter-group admin-filter-group--dates">
                            <Calendar
                                v-model="createdFrom"
                                placeholder="From Date"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                            <Calendar
                                v-model="createdTo"
                                placeholder="To Date"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                        </div>

                        <template #actions>
                            <ListExportActions
                                :loading="isExporting"
                                :disabled="!canExport"
                                @download="downloadList"
                                @export-csv="exportCsv"
                                @export-excel="exportExcel"
                                @print="printList"
                            />
                        </template>
                    </AdminListFilters>
                </template>

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-wrench"
                        title="No maintenance requests found"
                        message="There are no requests matching your filters."
                    />
                </template>
                <template #loading>Loading maintenance requests. Please wait.</template>

                <Column field="user_name" header="Resident" :sortable="true" style="min-width: 160px" />
                <Column field="title" header="Title" :sortable="true" style="min-width: 220px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="category" header="Category" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <span>{{ data.category || '—' }}</span>
                    </template>
                </Column>
                <Column field="priority" header="Priority" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <span class="capitalize">{{ data.priority || '—' }}</span>
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) || '—' }}
                    </template>
                </Column>
            </DataTable>

            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Dropdown from '@/components/global/AppDropdown.vue';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import {
    MAINTENANCE_PRIORITY_OPTIONS,
    MAINTENANCE_STATUS_OPTIONS,
} from '@/constants/constant';
import { formatDate } from '@/utils/formatter';
import { useMaintenanceRequestList } from './useMaintenanceRequestList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'MaintenanceRequestList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Calendar,
        Dropdown,
        Loading,
        AdminListFilters,
        StatusBadge,
        ListExportActions,
    },
    setup() {
        const list = useMaintenanceRequestList();

        return {
            ...list,
            formatDate,
            statusOptions: MAINTENANCE_STATUS_OPTIONS,
            priorityOptions: MAINTENANCE_PRIORITY_OPTIONS,
        };
    },
});
</script>
