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
                :value="contracts"
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
                        title="Sale Contract Approvals"
                        :search="search"
                        search-placeholder="Search contract, customer, room..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="selectedPaymentType"
                            :options="paymentTypeOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Payment Plan"
                            show-clear
                            class="w-52"
                        />
                        <div class="admin-filter-group admin-filter-group--dates">
                            <Calendar
                                v-model="dateFrom"
                                placeholder="DD/MM/YYYY"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                            <Calendar
                                v-model="dateTo"
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

                <template #empty>No pending sale contracts found.</template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column field="contract_no" header="Contract No" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showSaleContractApproval', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.contract_no }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="contract_total" header="Contract Total" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.contract_total) }}
                    </template>
                </Column>
                <Column field="payment_type" header="Payment Plan Type" :sortable="true" style="min-width: 150px">
                    <template #body="{ data }">
                        {{ getPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>
                <Column field="created_by" header="Created By" :sortable="true" style="min-width: 130px" />
                <Column field="created_at" header="Created Date" :sortable="true" style="min-width: 130px" />
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
            @confirm="onRejectConfirm"
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
import ApprovalListActions from '@/components/admin/ApprovalListActions.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { PAYMENT_PLAN_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { useSaleContractApprovalList } from './useSaleContractApprovalList';

export default defineComponent({
    name: 'SaleContractApprovalList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        ApprovalListActions,
        RejectContractDialog,
        ListExportActions,
        AdminListFilters,
    },
    setup() {
        const router = useRouter();
        const list = useSaleContractApprovalList();
        const showRejectDialog = ref(false);
        const selectedContract = ref(null);

        const approveFromList = async (contract) => {
            const approved = await list.approveContract(contract);

            if (approved) {
                router.push({ name: 'activeSaleList' });
            }
        };

        const rejectFromList = (contract) => {
            selectedContract.value = contract;
            showRejectDialog.value = true;
        };

        const onRejectConfirm = async (reason) => {
            if (!selectedContract.value) {
                return;
            }

            const rejected = await list.rejectContract(selectedContract.value, reason);

            if (rejected) {
                selectedContract.value = null;
                showRejectDialog.value = false;
                router.push({ name: 'saleContractDraftList' });
            }
        };

        return {
            ...list,
            paymentTypeOptions: PAYMENT_PLAN_TYPE_FILTER_OPTIONS,
            showRejectDialog,
            approveFromList,
            rejectFromList,
            onRejectConfirm,
        };
    },
});
</script>
