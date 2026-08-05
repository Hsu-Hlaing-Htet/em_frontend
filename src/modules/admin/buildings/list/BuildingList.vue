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
                :value="buildings"
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
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <p class="m-0 text-md">All Buildings</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
    <i
        class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
    />

    <InputText
        v-model="search"
        placeholder="Keyword search"
        class="w-72 !pl-10"
    />
</div>

                            <Button
                                label="Reset"
                                @click="resetSearch"
                            />
                            <router-link :to="{ name: 'newBuilding' }">
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

                <template #empty>No buildings found.</template>
                <template #loading>Loading buildings. Please wait.</template>

                <Column field="building_name" header="Building Name" :sortable="true" style="min-width: 200px">
                    <template #body="{ data }">
                        <router-link
    :to="{ name: 'showBuilding', params: { id: data.id } }"
    class="font-medium text-[var(--admin-primary)] hover:underline"
>
    {{ data.building_name }}
</router-link>
                    </template>
                </Column>

                <Column field="location" header="Location" :sortable="true" style="min-width: 180px" />
                <Column field="description" header="Description" :sortable="true" style="min-width: 220px">
                    <template #body="{ data }">
                        <span class="line-clamp-2">{{ data.description || '—' }}</span>
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 180px" />
                <Column
                                header="Actions"
                                :exportable="false"
                                style="width: 150px"
                            >   
                    <template #body="{ data }">
                        <router-link
            :to="{ name: 'editBuilding', params: { id: data.id } }"
        >
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
            @click="showConfirmDialog(data.id, data.building_name)"
        />
                    </template>
                </Column>
            </DataTable>
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
import { useBuildingList } from './useBuildingList';

export default defineComponent({
    name: 'RoomList',
    components: { DataTable, Column, InputText, Button, Loading, ListExportActions },
    setup() {
        return useBuildingList();
    },
});
</script>
