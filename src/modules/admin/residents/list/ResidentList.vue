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
                @page="onPage($event)"
                @sort="onSort($event)"
            >
                <template #header>
                    <div class="admin-list-toolbar">
                        <p class="admin-list-toolbar__title">All Residents</p>
                        <div class="admin-list-toolbar__controls">
                            <div class="admin-list-toolbar__search">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />

                                <InputText
                                    v-model="search"
                                    placeholder="Search name, email, phone, nrc..."
                                    class="w-full !pl-10"
                                />
                            </div>

                            <Button
                                label="Reset"
                                @click="resetSearch"
                            />

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

                        </div>
                    </div>
                </template>

                <template #empty>No residents found.</template>
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
                <Column field="phone" header="Phone" :sortable="true" style="min-width: 160px" />
                <Column field="nrc" header="NRC" :sortable="true" style="min-width: 100px" />
                <Column field="gender" header="Gender" :sortable="true" style="min-width: 90px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 100px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 140px" />
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editResident', params: { id: data.id } }">
                            <Button
                                icon="pi pi-pencil"
                                text
                                severity="info"
                            />
                        </router-link>

                        <Button
                            :icon="data.status === 'inactive' ? 'pi pi-refresh' : 'pi pi-ban'"
                            text
                            :severity="data.status === 'inactive' ? 'success' : 'warning'"
                            :title="data.status === 'inactive' ? 'Reactivate' : 'Deactivate'"
                            @click="showLifecycleDialog(data)"
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
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useResidentList } from './useResidentList';

export default defineComponent({
    name: 'ResidentList',
    components: { DataTable, Column, InputText, Button, Loading, ListExportActions, StatusBadge },
    setup() {
        return useResidentList();
    },
});
</script>
