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
                @page="onPage($event)"
                @sort="onSort($event)"
            >
                <template #header>
                    <AdminListFilters
                        title="Receipt Approvals"
                        :search="search"
                        search-placeholder="Search receipt #, payment ref, invoice #, or customer..."
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
                            placeholder="Issued from"
                            date-format="yy-mm-dd"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="issuedTo"
                            placeholder="Issued to"
                            date-format="yy-mm-dd"
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

                <template #empty>No pending receipts found.</template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column field="receipt_number" header="Receipt #" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showReceiptApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.receipt_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" style="min-width: 150px" />
                <Column field="property_unit" header="Property/Unit" style="min-width: 170px" />
                <Column header="Invoice Amount" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.invoice_amount) }}
                    </template>
                </Column>
                <Column header="Paid Amount" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.paid_amount ?? data.amount) }}
                    </template>
                </Column>
                <Column header="Balance" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.balance) }}
                    </template>
                </Column>
                <Column header="Payment Type" style="min-width: 110px">
                    <template #body="{ data }">
                        {{ formatPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>

                <Column field="payment_date" header="Payment Date" style="min-width: 120px" />
                <Column field="payment_method_name" header="Payment Method" style="min-width: 130px" />
                <Column header="Status" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.display_status || data.status" />
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
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import { formatCurrency } from '@/utils/formatter';
import { formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { useReceiptApprovalList } from './useReceiptApprovalList';

export default defineComponent({
    name: 'ReceiptApprovalList',
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
        const confirm = useConfirm();
        const list = useReceiptApprovalList();

        const approveFromList = (item) => {
            list.approveItem(item);
        };

        const rejectFromList = (item) => {
            confirm.require({
                message: 'Are you sure you want to reject this receipt?',
                header: 'Please confirm',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes, reject',
                rejectLabel: 'Cancel',
                accept: () => list.rejectItem(item),
            });
        };

        return {
            ...list,
            formatCurrency,
            formatPaymentTypeLabel,
            approveFromList,
            rejectFromList,
        };
    },
});
</script>
