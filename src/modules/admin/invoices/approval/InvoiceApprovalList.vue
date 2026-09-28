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
                :value="items"
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
                    style="min-width: 7.5rem; width: 7.5rem"
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
                    style="min-width: 8.5rem; width: 11rem"
                >
                    <template #body="{ data }">
                        <span class="admin-contract-party-names">{{ data.customer_name || '—' }}</span>
                    </template>
                </Column>

                <Column
                    field="building_name"
                    header="Building"
                    :sortable="true"
                    style="min-width: 8rem; width: 9.5rem"
                />

                <Column
                    field="room_number"
                    header="Room"
                    :sortable="true"
                    style="min-width: 4.5rem; width: 5rem"
                />

                <Column
                    field="total_amount"
                    header="Total (MMK)"
                    :sortable="true"
                    style="min-width: 7rem; width: 7.5rem"
                >
                    <template #body="{ data }">
                        {{ formatCurrency(invoiceTotal(data)) }}
                    </template>
                </Column>

                <Column
                    field="due_date"
                    header="Due Date"
                    :sortable="true"
                    style="min-width: 6.5rem; width: 7rem"
                >
                    <template #body="{ data }">
                        {{ formatDate(data.due_date) }}
                    </template>
                </Column>

                <Column
                    field="late_fee_selection"
                    header="Late Fee Rule"
                    :exportable="false"
                    style="min-width: 11.5rem; width: 11.5rem"
                >
                    <template #body="{ data }">
                        <div class="invoice-approval-late-fee-cell" @click.stop>
                            <Dropdown
                                :model-value="data.late_fee_selection"
                                :options="lateFeeRuleOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="Select Late Fee Rule"
                                class="invoice-approval-late-fee-dropdown"
                                @update:model-value="(value) => updateLateFeeSelection(data, value)"
                            />
                        </div>
                    </template>
                </Column>

                <Column
                    header="Action"
                    :exportable="false"
                    style="min-width: 5.5rem; width: 5.5rem"
                    body-class="invoice-approval-action-cell"
                >
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
import { formatCurrencyAmount as formatCurrency, formatDate } from '@/utils/formatter';
import { resolveInvoiceTotal } from '@/helpers/invoices/invoiceDetailHelpers';
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
            rejectFromList,
            onRejectConfirm,
            formatCurrency,
            formatDate,
            invoiceTotal: resolveInvoiceTotal,
        };
    },
});
</script>

<style scoped>
.invoice-approval-late-fee-cell {
    max-width: 11.5rem;
}

.invoice-approval-late-fee-dropdown {
    width: 11.5rem;
    max-width: 100%;
}

.invoice-approval-late-fee-dropdown :deep(.p-dropdown) {
    width: 100%;
}

.invoice-approval-late-fee-dropdown :deep(.p-dropdown-label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.invoice-approval-action-cell {
    vertical-align: middle;
}
</style>
