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
                        <p class="m-0 text-md">Sale Drafts</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />
                                <InputText
                                    v-model="search"
                                    placeholder="Search contract, customer, room..."
                                    class="w-72 !pl-10"
                                />
                            </div>

                            <Dropdown
                                v-model="selectedStatus"
                                :options="statusOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="All Status"
                                class="w-44"
                            />

                            <Calendar
                                v-model="dateFrom"
                                placeholder="From date"
                                date-format="yy-mm-dd"
                                show-icon
                                class="w-40"
                            />

                            <Calendar
                                v-model="dateTo"
                                placeholder="To date"
                                date-format="yy-mm-dd"
                                show-icon
                                class="w-40"
                            />

                            <Button label="Reset" @click="resetSearch" class="btn-outline"/>

                            <router-link :to="{ name: 'newSaleContractDraft' }">
                                <Button label="Create" class="btn" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No sale contract drafts found.</template>
                <template #loading>Loading sale drafts. Please wait.</template>

                <Column field="contract_no" header="Contract No" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showSaleContractDraft', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.contract_no }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="building_name" header="Building" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="contract_total" header="Contract Total" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.contract_total) }}
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <StatusTag :status="data.status" />
                    </template>
                </Column>
                <Column field="created_by" header="Created By" :sortable="true" style="min-width: 130px" />
                <Column field="created_at" header="Created Date" :sortable="true" style="min-width: 120px" />
                <Column header="Actions" :exportable="false" style="width: 120px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editSaleContractDraft', params: { id: data.id } }">
                            <Button icon="pi pi-pencil" text severity="info" />
                        </router-link>
                        <Button
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            @click="showConfirmDialog(data.id, data.contract_no)"
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
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusTag from '../../components/StatusTag.vue';
import { SALE_CONTRACT_DRAFT_STATUS_OPTIONS } from '@/constants/constant';
import { useSaleDraftList } from './useSaleDraftList';

export default defineComponent({
    name: 'SaleDraftList',
    components: {
        DataTable,
        Column,
        InputText,
        Dropdown,
        Calendar,
        Button,
        Loading,
        StatusTag,
    },
    setup() {
        const list = useSaleDraftList();

        return {
            ...list,
            statusOptions: SALE_CONTRACT_DRAFT_STATUS_OPTIONS,
        };
    },
});
</script>
