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
                :value="payments"
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
                        <p class="m-0 text-md">All Payments</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <Dropdown
                                v-model="statusFilter"
                                :options="statusOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="Status"
                                show-clear
                                class="w-40"
                            />
                            <Button label="Reset" @click="resetSearch" />
                            <router-link :to="{ name: 'newPayment' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No payments found.</template>
                <template #loading>Loading payments. Please wait.</template>

                <Column field="invoice_id" header="Invoice" :sortable="true" style="min-width: 90px" />
                <Column field="payment_method_name" header="Method" :sortable="true" style="min-width: 130px" />
                <Column field="amount" header="Amount" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showPayment', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.amount }}
                        </router-link>
                    </template>
                </Column>
                <Column field="payment_date" header="Date" :sortable="true" style="min-width: 120px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column header="Actions" :exportable="false" style="width: 80px">
                    <template #body="{ data }">
                        <Button
                            v-if="data.status === 'pending'"
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            @click="showConfirmDialog(data.id)"
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { PAYMENT_STATUS_OPTIONS } from '@/constants/constant';
import { usePaymentList } from './usePaymentList';

export default defineComponent({
    name: 'PaymentList',
    components: { DataTable, Column, Dropdown, Button, Loading, StatusBadge },
    setup() {
        const list = usePaymentList();

        return {
            ...list,
            statusOptions: PAYMENT_STATUS_OPTIONS,
        };
    },
});
</script>
