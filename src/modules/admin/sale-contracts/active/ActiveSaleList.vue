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

<p class="m-0 text-md">Active Sales</p>

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
                                v-model="selectedPaymentType"
                                :options="paymentTypeOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="All Payment Plan Types"
                                show-clear
                                class="w-52"
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
</div>

<div class="ml-auto flex items-center gap-2">
    <ListExportActions
        @download="downloadList"
        @export-csv="exportCsv"
        @export-excel="exportExcel"
        @print="printList"
    />
</div>

</div>
                </template>

             

                <template #empty>No active sales found.</template>
                <template #loading>Loading active sales. Please wait.</template>

                <Column field="contract_no" header="Contract No" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showActiveSale', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.contract_no }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="contract_total" header="Contract Total" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.contract_total) }}
                    </template>
                </Column>
                <Column field="paid_amount" header="Paid Amount" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.paid_amount) }}
                    </template>
                </Column>
                <Column field="remaining_amount" header="Remaining Amount" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.remaining_amount) }}
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-1">
                            <span>{{ data.created_at || '—' }}</span>
                            <span class="text-sm text-[var(--admin-text-muted)]">
                                {{ getPaymentTypeLabel(data.payment_type) }}
                            </span>
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
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import { PAYMENT_PLAN_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { useActiveSaleList } from './useActiveSaleList';

export default defineComponent({
    name: 'ActiveSaleList',
    components: {
        DataTable,
        Column,
        InputText,
        Dropdown,
        Calendar,
        Button,
        Loading,
        StatusBadge,
        ListExportActions,
    },
    setup() {
        const list = useActiveSaleList();

        return {
            ...list,
            paymentTypeOptions: PAYMENT_PLAN_TYPE_FILTER_OPTIONS,
        };
    },
});
</script>
