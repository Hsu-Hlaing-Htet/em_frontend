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
                :value="payments"
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
                        title="Payment Tracking"
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
                        <Dropdown
                            v-model="status"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Status"
                            class="w-36"
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
                        icon="pi pi-wallet"
                        title="No payments found"
                        message="No payments match your search or filters."
                    />
                </template>
                <template #loading>Loading payments. Please wait.</template>

                <Column field="invoice_number" header="Invoice No" :sortable="true" style="min-width: 130px" frozen>
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPayment', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_number || '—' }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" :sortable="true" style="min-width: 150px" />
                <Column field="invoice_amount" header="Invoice Amount (MMK)" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.invoice_amount) }}
                    </template>
                </Column>
                <Column field="amount" header="Paid Amount (MMK)" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.amount) }}
                    </template>
                </Column>
                <Column field="balance" header="Balance (MMK)" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.balance) }}
                    </template>
                </Column>
                <Column field="payment_type" header="Payment Type" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        {{ formatPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>

                <Column field="payment_date" header="Payment Date" :sortable="true" style="min-width: 120px" />
                <Column field="payment_method_name" header="Payment Method" :sortable="true" style="min-width: 130px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.display_status || data.status" />
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
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';
import { usePaymentList } from './usePaymentList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'PaymentList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        StatusBadge,
        ListExportActions,
    },
    setup() {
        const list = usePaymentList();

        return {
            ...list,
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
