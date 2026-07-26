<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative dashboard-panel">
            <DataTable
                ref="dt"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                scroll-height="58vh"
                :scrollable="true"
                :lazy="true"
                :paginator="true"
                :value="payments"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                @page="onPage($event)"
            >
                <template #header>
                    <AdminListFilters
                        title="Payment Tracking"
                        :search="search"
                        search-placeholder="Search payment, customer, invoice, property..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="billingStatusFilter"
                            :options="billingStatusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Status"
                            class="w-40"
                        />
                        <Dropdown
                            v-model="paymentTypeFilter"
                            :options="paymentTypeOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment type"
                            class="w-40"
                        />
                        <template #actions>
                            <router-link :to="{ name: 'newPayment' }">
                                <Button label="Create" />
                            </router-link>
                        </template>
                    </AdminListFilters>
                </template>

                <template #empty>No payments found.</template>
                <template #loading>Loading payments. Please wait.</template>

                <Column header="Payment ID" style="min-width: 130px" frozen>
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPayment', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.payment_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" style="min-width: 150px" />
                <Column field="property_unit" header="Property/Unit" style="min-width: 170px" />
                <Column field="invoice_number" header="Invoice No" style="min-width: 130px" />
                <Column header="Payment Type" style="min-width: 110px">
                    <template #body="{ data }">
                        {{ formatPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>
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
                <Column field="payment_date" header="Payment Date" style="min-width: 120px" />
                <Column field="payment_method_name" header="Payment Method" style="min-width: 130px" />
                <Column header="Status" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.display_status || data.status" />
                    </template>
                </Column>
                <Column field="reference_number" header="Reference No" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ data.reference_number || data.payment_number }}
                    </template>
                </Column>
                <Column field="note" header="Notes" style="min-width: 160px">
                    <template #body="{ data }">
                        {{ data.note || '—' }}
                    </template>
                </Column>
                <Column header="Actions" :exportable="false" style="min-width: 180px" frozen align-frozen="right">
                    <template #body="{ data }">
                        <div class="flex flex-wrap gap-1">
                            <router-link :to="{ name: 'showPayment', params: { id: data.id } }">
                                <Button label="View" text size="small" />
                            </router-link>
                            <router-link
                                v-if="data.status === 'pending'"
                                :to="{ name: 'showPayment', params: { id: data.id } }"
                            >
                                <Button label="Edit" text size="small" severity="info" />
                            </router-link>
                            <router-link
                                v-if="data.receipt_id"
                                :to="{ name: 'showReceipt', params: { id: data.receipt_id } }"
                            >
                                <Button label="Receipt" text size="small" severity="secondary" />
                            </router-link>
                            <Button
                                v-if="data.status === 'pending'"
                                icon="pi pi-trash"
                                text
                                size="small"
                                severity="danger"
                                @click="showConfirmDialog(data.id)"
                            />
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
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import {
    PAYMENT_LIST_BILLING_STATUS_OPTIONS,
    PAYMENT_TYPE_FILTER_OPTIONS,
} from '@/constants/constant';
import { formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { formatCurrency } from '@/utils/formatter';
import { usePaymentList } from './usePaymentList';

export default defineComponent({
    name: 'PaymentList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Button,
        Loading,
        AdminListFilters,
        StatusBadge,
    },
    setup() {
        const list = usePaymentList();

        return {
            ...list,
            billingStatusOptions: PAYMENT_LIST_BILLING_STATUS_OPTIONS,
            paymentTypeOptions: PAYMENT_TYPE_FILTER_OPTIONS,
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
