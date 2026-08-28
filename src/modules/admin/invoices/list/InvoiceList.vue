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
                :value="invoices"
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
                        title="Issued Invoices"
                        :search="search"
                        search-placeholder="Search invoice # or customer..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <div class="admin-filter-group">
                        <Dropdown
                            v-model="buildingId"
                            :options="buildingOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Building"
                            show-clear
                            class="w-44"
                        />
                        <Dropdown
                            v-model="roomId"
                            :options="roomOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Room"
                            :disabled="!buildingId"
                            show-clear
                            class="w-36"
                        />
                        </div>
                        <div class="admin-filter-group admin-filter-group--dates">
                        <Calendar
                            v-model="issuedFrom"
                            placeholder="DD/MM/YYYY"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="issuedTo"
                            placeholder="DD/MM/YYYY"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        </div>
                        <div class="admin-filter-group admin-filter-group--dates">
                        <Calendar
                            v-model="dueFrom"
                            placeholder="DD/MM/YYYY"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="dueTo"
                            placeholder="DD/MM/YYYY"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        </div>
                        <Dropdown
                            v-model="paymentStatusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment Status"
                            show-clear
                            class="w-44"
                        />
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

                <template #empty>No issued invoices found.</template>
                <template #loading>Loading invoices. Please wait.</template>

                <Column
                    field="invoice_number"
                    header="Invoice #"
                    :sortable="true"
                    style="min-width: 150px"
                >
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showInvoice', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_number }}
                        </router-link>
                    </template>
                </Column>

                <Column
                    field="customer_name"
                    header="Customer"
                    :sortable="true"
                    style="min-width: 150px"
                />

                <Column
                    field="building_name"
                    header="Building"
                    :sortable="true"
                    style="min-width: 180px"
                />

                <Column
                    field="room_number"
                    header="Room"
                    :sortable="true"
                    style="min-width: 100px"
                />

                <Column
                    field="total_amount"
                    header="Total"
                    :sortable="true"
                    style="min-width: 130px"
                >
                    <template #body="{ data }">
                        {{ formatCurrency(data.total_amount) }}
                    </template>
                </Column>

                <Column
                    field="issued_date"
                    header="Issue Date"
                    :sortable="true"
                    style="min-width: 130px"
                >
                    <template #body="{ data }">
                        {{ formatDate(data.issued_date) }}
                    </template>
                </Column>

                <Column
                    field="due_date"
                    header="Due Date"
                    :sortable="true"
                    style="min-width: 130px"
                >
                    <template #body="{ data }">
                        {{ formatDate(data.due_date) }}
                    </template>
                </Column>

                <Column header="Status" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.payment_status || data.display_status || data.status" />
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
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { INVOICE_LIST_STATUS_OPTIONS } from '@/constants/constant';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { useInvoiceList } from './useInvoiceList';

export default defineComponent({
    name: 'InvoiceList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        StatusBadge, ListExportActions },
    setup() {
        const list = useInvoiceList();

        return {
            ...list,
            statusOptions: INVOICE_LIST_STATUS_OPTIONS,
            formatCurrency,
            formatDate,
        };
    },
});
</script>
