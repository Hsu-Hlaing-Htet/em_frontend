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
                :value="items"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                @page="onPage($event)"
            >
                <template #header>
                    <AdminListFilters
                        title="Payment Approvals"
                        :search="search"
                        search-placeholder="Search payment ref, invoice #, or customer..."
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
                        <Dropdown
                            v-model="paymentMethodId"
                            :options="paymentMethodOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment method"
                            show-clear
                            class="w-44"
                        />
                        <div class="admin-filter-group admin-filter-group--dates">
                        <Calendar
                            v-model="paymentDateFrom"
                            placeholder="DD/MM/YYYY"
                            date-format="dd/mm/yy"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="paymentDateTo"
                            placeholder="DD/MM/YYYY"
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

                <template #empty>No pending payments found.</template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column header="Invoice No" style="min-width: 130px" frozen>
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPaymentApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_number || '—' }}
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
                <Column header="Previously Paid" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.paid_amount) }}
                    </template>
                </Column>
                <Column header="Current Balance" style="min-width: 120px">
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
                <Column field="note" header="Notes" style="min-width: 160px">
                    <template #body="{ data }">
                        {{ data.note || '—' }}
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
            header="Reject Payment"
            description="Please provide a reason explaining why this payment is being rejected."
            @confirm="confirmReject"
        />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import { formatPaymentTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { formatCurrency } from '@/utils/formatter';
import { usePaymentApprovalList } from './usePaymentApprovalList';

export default defineComponent({
    name: 'PaymentApprovalList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        StatusBadge,
        ApprovalListActions,
        ListExportActions,
        RejectContractDialog,
    },
    setup() {
        const router = useRouter();
        const list = usePaymentApprovalList();
        const showRejectDialog = ref(false);
        const rejectTarget = ref(null);

        const approveFromList = (item) => {
            router.push({ name: 'showPaymentApproval', params: { id: item.id } });
        };

        const rejectFromList = (item) => {
            rejectTarget.value = item;
            showRejectDialog.value = true;
        };

        const confirmReject = async (reason) => {
            if (!rejectTarget.value) {
                return;
            }

            await list.rejectItem(rejectTarget.value, { rejection_reason: reason });
            rejectTarget.value = null;
        };

        return {
            ...list,
            showRejectDialog,
            formatPaymentTypeLabel,
            formatCurrency,
            approveFromList,
            rejectFromList,
            confirmReject,
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
