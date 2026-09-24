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
                :value="residents"
                :multi-sort-meta="lazyParams.multiSortMeta"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                removable-sort
                row-hover
                class="admin-clickable-rows admin-residents-table"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="All Residents"
                        :search="search"
                        search-placeholder="Search name, email, phone, nrc..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <template #actions>
                            <router-link :to="{ name: 'newResident' }">
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

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-users"
                        title="No residents found"
                        message="Add a resident or clear filters to see matches."
                    />
                </template>
                <template #loading>Loading residents. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showResident', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.name }}
                        </router-link>
                    </template>
                </Column>
                <Column field="email" header="Email" :sortable="true" style="min-width: 90px" />
                <Column field="phone" header="Phone" style="min-width: 160px" />
                <Column field="nrc" header="NRC" style="min-width: 100px" />
                <Column field="gender" header="Gender" style="min-width: 90px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 100px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) || '—' }}
                    </template>
                </Column>
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 7rem"
                >
                    <template #body="{ data }">
                        <div class="admin-table-actions">
                            <router-link :to="{ name: 'editResident', params: { id: data.id } }">
                                <Button
                                    icon="pi pi-pencil"
                                    text
                                    severity="info"
                                    title="Edit"
                                    aria-label="Edit"
                                />
                            </router-link>

                            <Button
                                :icon="data.status === 'inactive' ? 'pi pi-refresh' : 'pi pi-ban'"
                                text
                                :severity="data.status === 'inactive' ? 'success' : 'warning'"
                                :title="data.status === 'inactive' ? 'Reactivate' : 'Deactivate'"
                                :aria-label="data.status === 'inactive' ? 'Reactivate' : 'Deactivate'"
                                @click="showLifecycleDialog(data)"
                            />
                        </div>
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
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { formatDate } from '@/utils/formatter';
import { useResidentList } from './useResidentList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'ResidentList',
    components: {
        AdminEmptyState, DataTable, Column, Button, Loading, ListExportActions, AdminListFilters, StatusBadge },
    setup() {
        return {
            ...useResidentList(),
            formatDate,
        };
    },
});
</script>
