<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative dashboard-panel">
            <DataTable
                ref="dt"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                sort-mode="multiple"
                scroll-height="58vh"
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
                        title="Payment Approvals"
                        :search="search"
                        search-placeholder="Search payment ref, invoice no, customer, or room..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="paymentType"
                            :options="paymentTypeOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment Type"
                            show-clear
                            class="w-40"
                        />
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
                            v-model="paymentDateFrom"
                            placeholder="From Date"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="paymentDateTo"
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
                        icon="pi pi-check-circle"
                        title="No pending payments"
                        message="There are no payments waiting for approval."
                    />
                </template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column field="invoice_number" header="Invoice No" :sortable="true" style="min-width: 130px" frozen>
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPaymentApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_number || '—' }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 150px" />
                <Column field="invoice_amount" header="Due (MMK)" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.invoice_amount) }}
                    </template>
                </Column>
                <Column field="amount" header="Amount (MMK)" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.amount) }}
                    </template>
                </Column>
                <Column field="payment_type" header="Type" :sortable="true" style="min-width: 100px">
                    <template #body="{ data }">
                        {{ formatPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>
                <Column field="payment_date" header="Date" :sortable="true" style="min-width: 120px" />
                <Column field="payment_method_name" header="Method" :sortable="true" style="min-width: 120px" />
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
            entity="payment"
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
import { formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';
import { usePaymentApprovalList } from './usePaymentApprovalList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'PaymentApprovalList',
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
        const list = usePaymentApprovalList();
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
            formatPaymentTypeLabel,
            formatCurrency,
        };
    },
});
</script>

<style scoped>
.dashboard-panel {
    border-radius: 1rem;
    border: 1px solid var(--admin-border);
    box-shadow: var(--admin-shadow-soft);
}
</style>
