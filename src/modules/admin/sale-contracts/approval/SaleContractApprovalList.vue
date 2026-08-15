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
                    <div class="admin-list-toolbar">
                        <div class="admin-list-toolbar__heading">
                            <p class="admin-list-toolbar__title">Sale Contract Approvals</p>

                        </div>
                        <div class="admin-list-toolbar__controls">
 
 <div class="admin-list-toolbar__search">
                             <i
                                 class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                             />
                             <InputText
                                 v-model="search"
                                 placeholder="Search contract, customer, room..."
                                 class="w-full !pl-10"
                             />
                         </div>

                         <Dropdown
                             v-model="selectedPaymentType"
                             :options="paymentTypeOptions"
                             option-label="label"
                             option-value="value"
                             placeholder="All Payment Plan Types"
                             show-clear
                             class="w-52"
                         />

                         <div class="admin-filter-group admin-filter-group--dates">
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
                         </div>

                         <Button label="Reset" @click="resetSearch" class="btn-outline"/>

               
</div>

<div class="admin-list-toolbar__actions">
 <ListExportActions
                                :loading="isExporting"
                                :disabled="!canExport"
                                @download="downloadList"
                                @export-csv="exportCsv"
                                @export-excel="exportExcel"
                                @print="printList"
                            />
</div>
                    </div>
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
                <Column header="Actions" :exportable="false" style="min-width: 180px">
                    <template #body="{ data }">
                        <Button
                        text
                            icon="pi pi-check"
                            severity="success"
    
                            @click="approveFromList(data)"
                        />
                        <Button
                        text
                            icon="pi pi-times"
                            severity="danger"
                            @click="rejectFromList(data)"
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
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import { PAYMENT_PLAN_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { useSaleContractApprovalList } from './useSaleContractApprovalList';

export default defineComponent({
    name: 'SaleContractApprovalList',
    components: {
        DataTable,
        Column,
        InputText,
        Dropdown,
        Calendar,
        Button,
        Loading,
        RejectContractDialog,
        ListExportActions,
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
