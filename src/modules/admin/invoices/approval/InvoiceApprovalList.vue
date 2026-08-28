<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel invoice-approval-panel relative">
            <DataTable
                ref="dt"
                class="invoice-approval-table"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                sort-mode="multiple"
                scroll-height="50vh"
                table-style="min-width: 1360px"
                :scrollable="true"
                :lazy="true"
                :paginator="true"
                :value="items"
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
                        title="Invoice Approvals"
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

                <template #empty>No pending invoices found.</template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column
                    field="invoice_number"
                    header="Invoice #"
                    :sortable="true"
                    style="width: 160px; min-width: 160px"
                >
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showInvoiceApproval', params: { id: data.id } }"
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
                    style="width: 180px; min-width: 180px"
                />

                <Column
                    field="building_name"
                    header="Building"
                    :sortable="true"
                    style="width: 190px; min-width: 190px"
                />

                <Column
                    field="room_number"
                    header="Room"
                    :sortable="true"
                    style="width: 110px; min-width: 110px"
                />

                <Column
                    field="total_amount"
                    header="Total"
                    :sortable="true"
                    header-class="invoice-approval-numeric"
                    body-class="invoice-approval-numeric"
                    style="width: 150px; min-width: 150px"
                >
                    <template #body="{ data }">
                        {{ formatCurrency(data.total_amount) }}
                    </template>
                </Column>

                <Column
                    field="due_date"
                    header="Due Date"
                    :sortable="true"
                    header-class="invoice-approval-nowrap"
                    body-class="invoice-approval-nowrap"
                    style="width: 150px; min-width: 150px"
                >
                    <template #body="{ data }">
                        {{ formatDate(data.due_date) }}
                    </template>
                </Column>

                <Column
                    header="Status"
                    header-class="invoice-approval-nowrap"
                    body-class="invoice-approval-nowrap"
                    style="width: 150px; min-width: 150px"
                >
                    <template #body="{ data }">
                        <StatusBadge :value="data.payment_status || data.display_status || data.status" />
                    </template>
                </Column>

                <Column
                    header="Actions"
                    :exportable="false"
                    header-class="invoice-approval-nowrap"
                    body-class="invoice-approval-nowrap"
                    style="width: 120px; min-width: 120px"
                >
                    <template #body="{ data }">
                        <ApprovalListActions
                            :can-reject="false"
                            approve-label="Approve"
                            @approve="approveFromList(data)"
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
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import { INVOICE_LIST_STATUS_OPTIONS } from '@/constants/constant';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { useInvoiceApprovalList } from './useInvoiceApprovalList';

export default defineComponent({
    name: 'InvoiceApprovalList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        StatusBadge,
        ApprovalListActions, ListExportActions },
    setup() {
        const list = useInvoiceApprovalList();

        const approveFromList = (item) => {
            list.approveItem(item);
        };

        return {
            ...list,
            statusOptions: INVOICE_LIST_STATUS_OPTIONS,
            formatCurrency,
            formatDate,
            approveFromList,
        };
    },
});
</script>

<style scoped>
.invoice-approval-panel {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
}

:deep(.invoice-approval-table),
:deep(.invoice-approval-table .p-datatable-wrapper) {
    min-width: 0;
    max-width: 100%;
}

:deep(.invoice-approval-table .p-datatable-wrapper) {
    overflow-x: auto;
    overflow-y: hidden;
}

:deep(.invoice-approval-table .p-datatable-table) {
    width: 100%;
    min-width: 1360px;
}

:deep(.invoice-approval-table .p-datatable-thead > tr > th) {
    vertical-align: middle;
}

:deep(.invoice-approval-table .invoice-approval-nowrap) {
    white-space: nowrap;
}

:deep(.invoice-approval-table .invoice-approval-numeric) {
    text-align: right;
}

:deep(.invoice-approval-table .p-paginator) {
    max-width: 100%;
}

</style>
