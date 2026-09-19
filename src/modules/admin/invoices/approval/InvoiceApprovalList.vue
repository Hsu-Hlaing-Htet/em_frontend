<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel invoice-approval-panel relative">
            <DataTable
                ref="dt"
                class="invoice-approval-table admin-clickable-rows"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                sort-mode="multiple"
                scroll-height="50vh"
                table-style="min-width: 1210px"
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
                row-hover
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
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
                        <div class="admin-filter-group admin-filter-group--dates">
                            <Calendar
                                v-model="dueFrom"
                                placeholder="Due From"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                            <Calendar
                                v-model="dueTo"
                                placeholder="Due To"
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
                        icon="pi pi-check-circle"
                        title="No pending invoices"
                        message="There are no invoices waiting for approval."
                    />
                </template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column
                    field="invoice_number"
                    header="Invoice #"
                    :sortable="true"
                    style="width: 160px; min-width: 160px"
                >
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'invoiceApprovalDocument', params: { id: data.id } }"
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
                    header="Total (MMK)"
                    :sortable="true"
                    header-class="invoice-approval-total"
                    body-class="invoice-approval-total"
                    style="width: 140px; min-width: 140px; max-width: 140px"
                >
                    <template #body="{ data }">
                        <span class="invoice-approval-total__value">
                            {{ formatCurrencyAmount(data.total_amount) }}
                        </span>
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

                <Column header="Actions" :exportable="false" style="min-width: 120px">
                    <template #body="{ data }">
                        <ApprovalListActions
                            @approve="approveFromList(data)"
                            @reject="rejectFromList(data)"
                        />
                    </template>
                </Column>
            </DataTable>

            <Loading v-if="isLoading" />
        </div>

        <RejectContractDialog
            v-model="showRejectDialog"
            entity="invoice"
            :close-on-confirm="false"
            @confirm="onRejectConfirm"
        />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { formatCurrencyAmount, formatDate } from '@/utils/formatter';
import { useInvoiceApprovalList } from './useInvoiceApprovalList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'InvoiceApprovalList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        ApprovalListActions,
        RejectContractDialog,
        ListExportActions,
    },
    setup() {
        const list = useInvoiceApprovalList();
        const showRejectDialog = ref(false);
        const selectedItem = ref(null);

        const approveFromList = (item) => {
            list.approveItem(item);
        };

        const rejectFromList = (item) => {
            selectedItem.value = item;
            showRejectDialog.value = true;
        };

        const onRejectConfirm = async (reason) => {
            if (!selectedItem.value) {
                return;
            }

            const rejected = await list.rejectItem(selectedItem.value, {
                rejection_reason: reason,
            });

            if (rejected) {
                selectedItem.value = null;
                showRejectDialog.value = false;
            }
        };

        return {
            ...list,
            showRejectDialog,
            approveFromList,
            rejectFromList,
            onRejectConfirm,
            formatCurrencyAmount,
            formatDate,
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
    min-width: 1210px;
}

:deep(.invoice-approval-table .p-datatable-thead > tr > th) {
    vertical-align: middle;
}

:deep(.invoice-approval-table .invoice-approval-nowrap) {
    white-space: nowrap;
}

:deep(.invoice-approval-table .invoice-approval-total) {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
    text-align: right !important;
    white-space: nowrap;
    vertical-align: middle;
    font-size: inherit;
    font-weight: inherit;
}

:deep(.invoice-approval-table .invoice-approval-total .p-column-header-content) {
    justify-content: flex-end;
    width: 100%;
    white-space: nowrap;
    font-size: inherit;
    font-weight: inherit;
}

:deep(.invoice-approval-table .invoice-approval-total .p-column-title) {
    white-space: nowrap;
}

.invoice-approval-total__value {
    display: block;
    width: 100%;
    text-align: right;
    white-space: nowrap;
    font-size: inherit;
    font-weight: inherit;
    font-variant-numeric: tabular-nums;
    line-height: inherit;
}

:deep(.invoice-approval-table .p-paginator) {
    max-width: 100%;
}

</style>
