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
                :value="contracts"
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
                        <p class="m-0 text-md">All Contracts</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />
                                <InputText
                                    v-model="search"
                                    placeholder="Search contract number..."
                                    class="w-72 !pl-10"
                                />
                            </div>
                            <Dropdown
                                v-model="statusFilter"
                                :options="statusOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="Status"
                                show-clear
                                class="w-40"
                            />
                            <Button label="Reset" @click="resetSearch" />
                            <router-link :to="{ name: 'newContract' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No contracts found.</template>
                <template #loading>Loading contracts. Please wait.</template>

                <Column field="contract_number" header="Contract #" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showContract', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.contract_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="user_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="type" header="Type" :sortable="true" style="min-width: 90px" />
                <Column field="contract_total" header="Total" :sortable="true" style="min-width: 110px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="start_date" header="Start" :sortable="true" style="min-width: 120px" />
                <Column header="Actions" :exportable="false" style="width: 150px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editContract', params: { id: data.id } }">
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
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { CONTRACT_STATUS_OPTIONS } from '@/constants/constant';
import { useContractList } from './useContractList';

export default defineComponent({
    name: 'ContractList',
    components: { DataTable, Column, InputText, Dropdown, Button, Loading, StatusBadge },
    setup() {
        const list = useContractList();

        return {
            ...list,
            statusOptions: CONTRACT_STATUS_OPTIONS,
        };
    },
});
</script>
