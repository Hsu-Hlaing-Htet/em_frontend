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
                        title="Payment Approvals"
                        :search="search"
                        search-placeholder="Search invoice, method..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Calendar
                            v-model="dateFrom"
                            placeholder="From date"
                            date-format="yy-mm-dd"
                            show-icon
                            class="w-40"
                        />
                        <Calendar
                            v-model="dateTo"
                            placeholder="To date"
                            date-format="yy-mm-dd"
                            show-icon
                            class="w-40"
                        />
                    </AdminListFilters>
                </template>

                <template #empty>No pending payments found.</template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column field="invoice_id" header="Invoice" :sortable="true" style="min-width: 90px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPaymentApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_id }}
                        </router-link>
                    </template>
                </Column>
                <Column field="payment_method_name" header="Method" :sortable="true" style="min-width: 130px" />
                <Column field="amount" header="Amount" :sortable="true" style="min-width: 110px" />
                <Column field="payment_date" header="Payment Date" :sortable="true" style="min-width: 130px" />
                <Column field="created_at" header="Created Date" :sortable="true" style="min-width: 160px" />
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
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import { usePaymentApprovalList } from './usePaymentApprovalList';

export default defineComponent({
    name: 'PaymentApprovalList',
    components: {
        DataTable,
        Column,
        Calendar,
        Loading,
        AdminListFilters,
        ApprovalListActions,
    },
    setup() {
        const confirm = useConfirm();
        const list = usePaymentApprovalList();

        const approveFromList = (item) => {
            list.approveItem(item);
        };

        const rejectFromList = (item) => {
            confirm.require({
                message: 'Are you sure you want to reject this payment?',
                header: 'Please confirm',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes, reject',
                rejectLabel: 'Cancel',
                accept: () => list.rejectItem(item),
            });
        };

        return {
            ...list,
            approveFromList,
            rejectFromList,
        };
    },
});
</script>
