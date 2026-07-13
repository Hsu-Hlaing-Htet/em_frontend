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
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p class="m-0 text-md">Sale Contract Approvals</p>

                        </div>
                        <div class="flex flex-wrap items-center gap-2">
 
 <div class="relative">
                             <i
                                 class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                             />
                             <InputText
                                 v-model="search"
                                 placeholder="Search contract, customer, room..."
                                 class="w-72 !pl-10"
                             />
                         </div>

                         <Dropdown
                             v-model="selectedStatus"
                             :options="statusOptions"
                             option-label="label"
                             option-value="value"
                             placeholder="All Status"
                             class="w-44"
                         />

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

                         <Button label="Reset" @click="resetSearch" class="btn-outline"/>

               
</div>

<div class="ml-auto flex items-center gap-2">
 <Button
     label="Export"
     icon="pi pi-upload"
     severity="secondary"
     @click="exportList"
 />

 <Button
     label="Download"
     icon="pi pi-download"
     @click="downloadList"
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
                <Column field="building_name" header="Building" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="contract_total" header="Contract Total" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.contract_total) }}
                    </template>
                </Column>
                <Column field="submitted_by" header="Created By" :sortable="true" style="min-width: 130px" />
                <Column field="submitted_at" header="Created Date" :sortable="true" style="min-width: 130px" />
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
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import EventBus from '@/libs/AppEventBus';
import RejectContractDialog from '../../components/RejectContractDialog.vue';
import { useSaleContractApprovalList } from './useSaleContractApprovalList';

export default defineComponent({
    name: 'SaleContractApprovalList',
    components: {
        DataTable,
        Column,
        InputText,
        Button,
        Loading,
        RejectContractDialog,
    },
    setup() {
        const router = useRouter();
        const list = useSaleContractApprovalList();
        const showRejectDialog = ref(false);
        const selectedContract = ref(null);

        const approveFromList = (contract) => {
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: `${contract.contract_no} approved and moved to Active Sales.`,
            });
            router.push({ name: 'activeSaleList' });
        };

        const rejectFromList = (contract) => {
            selectedContract.value = contract;
            showRejectDialog.value = true;
        };

        const onRejectConfirm = () => {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: `${selectedContract.value?.contract_no} has been rejected.`,
            });
            selectedContract.value = null;
        };

        return {
            ...list,
            showRejectDialog,
            approveFromList,
            rejectFromList,
            onRejectConfirm,
        };
    },
});
</script>
