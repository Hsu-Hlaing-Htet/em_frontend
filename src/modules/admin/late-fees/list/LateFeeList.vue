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
                :value="lateFees"
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
                        title="All Late Fees"
                        :search="search"
                        search-placeholder="Keyword search"
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <template #actions>
                            <router-link :to="{ name: 'newLateFee' }">
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
                        icon="pi pi-clock"
                        title="No late fees found"
                        message="Create a late fee rule or clear filters."
                    />
                </template>
                <template #loading>Loading late fees. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 180px" />
                <Column field="type" header="Type" :sortable="true" style="min-width: 120px" />
                <Column field="value" header="Value" :sortable="true" style="min-width: 100px" />
                <Column field="per" header="Per" :sortable="true" style="min-width: 100px" />
                <Column field="grace_days" header="Grace Days" :sortable="true" style="min-width: 120px" />
                <Column field="is_default" header="Default" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <InputSwitch
                            :model-value="Boolean(data.is_default)"
                            :disabled="data.status !== 'active'"
                            @update:model-value="(value) => toggleDefault(data, value)"
                        />
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <div class="flex items-center gap-3">
                            <StatusBadge :value="data.status" />
                            <InputSwitch
                                :model-value="data.status === 'active'"
                                @update:model-value="(value) => toggleStatus(data, value)"
                            />
                        </div>
                    </template>
                </Column>
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editLateFee', params: { id: data.id } }">
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
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useLateFeeList } from './useLateFeeList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'LateFeeList',
    components: {
        AdminEmptyState, DataTable, Column, InputSwitch, StatusBadge, Button, Loading, ListExportActions, AdminListFilters },
    setup() {
        return useLateFeeList();
    },
});
</script>
