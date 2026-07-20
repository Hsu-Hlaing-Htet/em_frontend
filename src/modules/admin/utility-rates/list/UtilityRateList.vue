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
                :value="utilityRates"
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
                        <p class="m-0 text-md">All Utility Rates</p>
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

                            <router-link :to="{ name: 'newUtilityRate' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No utility rates found.</template>
                <template #loading>Loading utility rates. Please wait.</template>

                <Column field="type_name" header="Utility Type" :sortable="true" style="min-width: 180px" />
                <Column field="unit_price" header="Unit Price" :sortable="true" style="min-width: 120px" />
                <Column field="effective_date" header="Effective Date" :sortable="true" style="min-width: 140px" />
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
                        <router-link :to="{ name: 'editUtilityRate', params: { id: data.id } }">
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
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useUtilityRateList } from './useUtilityRateList';

export default defineComponent({
    name: 'UtilityRateList',
    components: { DataTable, Column, InputText, InputSwitch, StatusBadge, Button, Loading },
    setup() {
        return useUtilityRateList();
    },
});
</script>
