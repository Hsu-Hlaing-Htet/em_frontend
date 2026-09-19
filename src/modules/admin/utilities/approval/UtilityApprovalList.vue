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
                        title="Utility Approvals"
                        :search="search"
                        search-placeholder="Search room, customer, building, utility type, billing month..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="buildingFilter"
                            :options="buildingOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Building"
                            show-clear
                            filter
                            class="w-44"
                        />
                        <div class="admin-filter-group admin-filter-group--dates">
                            <Calendar
                                v-model="billingMonthFrom"
                                placeholder="From Date"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                            <Calendar
                                v-model="billingMonthTo"
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
                        title="No pending utilities"
                        message="There are no utility records waiting for approval."
                    />
                </template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="building_name" header="Building" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ data.building_name || '—' }}
                    </template>
                </Column>
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showUtilityApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.room_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="billing_month" header="Billing Month" :sortable="true" style="min-width: 150px">
                    <template #body="{ data }">
                        {{ formatBillingMonthLabel(data.billing_month) }}
                    </template>
                </Column>
                <Column field="total_amount" header="Total (MMK)" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        {{ formatCurrencyAmount(data.total_amount) }}
                    </template>
                </Column>
                <Column field="created_by" header="Created By" :sortable="true" style="min-width: 120px" />
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
            entity="utility"
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
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import { formatBillingMonthLabel } from '@/helpers/documents/billingDocumentHelpers';
import { formatCurrencyAmount } from '@/utils/formatter';
import { useUtilityApprovalList } from './useUtilityApprovalList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'UtilityApprovalList',
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
        const list = useUtilityApprovalList();
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
            formatBillingMonthLabel,
            formatCurrencyAmount,
        };
    },
});
</script>
