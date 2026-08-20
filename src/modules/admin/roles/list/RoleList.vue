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
                :value="roles"
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
                        title="All Roles"
                        :search="search"
                        search-placeholder="Keyword search"
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <template #actions>
                            <router-link :to="{ name: 'newRole' }">
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

                <template #empty>No roles found.</template>
                <template #loading>Loading roles. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 200px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'showRole', params: { id: data.id } }">
                            {{ data.name }}
                        </router-link>
                    </template>
                </Column>

                <Column field="created_at" header="Created" :sortable="true" style="min-width: 180px" />
                <Column field="action" header="Action" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editRole', params: { id: data.id } }">
                            <Button
                                icon="pi pi-pencil"
                                text
                                severity="info"
                            />
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
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { useRoleList } from './useRoleList';

export default defineComponent({
    name: 'RoleList',
    components: {
        DataTable,
        Column,
        Button,
        Loading,
        ListExportActions,
        AdminListFilters,
    },
    setup() {
        return useRoleList();
    },
});
</script>
