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
                :value="utilityTypes"
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
                    <div class="admin-list-toolbar">
                        <p class="admin-list-toolbar__title">All Utility Types</p>
                        <div class="admin-list-toolbar__controls">
                            <div class="admin-list-toolbar__search">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />

                                <InputText
                                    v-model="search"
                                    placeholder="Keyword search"
                                    class="w-full !pl-10"
                                />
                            </div>

                            <Button
                                label="Reset"
                                @click="resetSearch"
                            />

                            <router-link :to="{ name: 'newUtilityType' }">
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

                        </div>
                    </div>
                </template>

                <template #empty>No utility types found.</template>
                <template #loading>Loading utility types. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 200px" />
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
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 180px" />
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editUtilityType', params: { id: data.id } }">
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
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useUtilityTypeList } from './useUtilityTypeList';

export default defineComponent({
    name: 'UtilityTypeList',
    components: { DataTable, Column, InputText, InputSwitch, StatusBadge, Button, Loading, ListExportActions },
    setup() {
        return useUtilityTypeList();
    },
});
</script>
