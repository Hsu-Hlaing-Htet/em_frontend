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
                :value="receipts"
                :multi-sort-meta="lazyParams.multiSortMeta"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                removable-sort
                row-hover
                class="admin-clickable-rows"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="All Receipts"
                        :search="search"
                        search-placeholder="Search receipt no, invoice no, customer, or room..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="paymentMethodId"
                            :options="paymentMethodOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment Method"
                            show-clear
                            class="w-44"
                        />
                        <div class="admin-filter-group admin-filter-group--dates">
                        <Calendar
                            v-model="issuedFrom"
                            placeholder="From Date"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="issuedTo"
                            placeholder="To Date"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        </div>
                        <template #actions>
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
                        icon="pi pi-receipt"
                        title="No receipts found"
                        message="No receipts match your search or filters."
                    />
                </template>
                <template #loading>Loading receipts. Please wait.</template>

                <Column field="receipt_number" header="Receipt #" :sortable="true" style="min-width: 170px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'receiptDocument', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.receipt_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" :sortable="true" style="min-width: 180px" />
                <Column field="invoice_number" header="Invoice No." :sortable="true" style="min-width: 140px" />
                <Column field="paid_amount" header="Amount Received (MMK)" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.paid_amount ?? data.amount) }}
                    </template>
                </Column>
                <Column field="payment_date" header="Payment Date" :sortable="true" style="min-width: 135px" />
                <Column field="payment_method_name" header="Payment Method" :sortable="true" style="min-width: 150px" />
            </DataTable>

            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';
import { useReceiptList } from './useReceiptList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'ReceiptList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        ListExportActions,
    },
    setup() {
        const list = useReceiptList();

        return {
            ...list,
            formatCurrency,
        };
    },
});
</script>
