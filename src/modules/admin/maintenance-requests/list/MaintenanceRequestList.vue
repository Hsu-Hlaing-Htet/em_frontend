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
                @page="onPage($event)"
                @sort="onSort($event)"
            >
                <template #header>
                    <AdminListFilters
                        title="All Maintenance Requests"
                        :search="search"
                        search-placeholder="Search title, description..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="statusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="All Statuses"
                            show-clear
                            class="w-52"
                        />

                        <template #actions>
                            <router-link :to="{ name: 'newMaintenanceRequest' }">
                                <Button label="Create" />
                            </router-link>
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

                <template #empty>No maintenance requests found.</template>
                <template #loading>Loading maintenance requests. Please wait.</template>

                <Column field="title" header="Title" :sortable="true" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showMaintenanceRequest', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.title }}
                        </router-link>
                    </template>
                </Column>
                <Column field="category" header="Category" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <span class="capitalize">{{ data.category || '—' }}</span>
                    </template>
                </Column>
                <Column field="priority" header="Priority" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <span class="capitalize">{{ data.priority || '—' }}</span>
                    </template>
                </Column>
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="user_name" header="Resident" :sortable="true" style="min-width: 140px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created" :sortable="true" style="min-width: 160px" />
                <Column header="Actions" :exportable="false" style="width: 150px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editMaintenanceRequest', params: { id: data.id } }">
                            <Button icon="pi pi-pencil" text severity="info" />
                        </router-link>
                        <Button
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            @click="showConfirmDialog(data.id)"
                        />
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
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { MAINTENANCE_STATUS_OPTIONS } from '@/constants/constant';
import { useMaintenanceRequestList } from './useMaintenanceRequestList';

export default defineComponent({
    name: 'MaintenanceRequestList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Button,
        Loading,
        AdminListFilters,
        StatusBadge, ListExportActions },
    setup() {
        const list = useMaintenanceRequestList();

        return {
            ...list,
            statusOptions: MAINTENANCE_STATUS_OPTIONS,
        };
    },
});
</script>
