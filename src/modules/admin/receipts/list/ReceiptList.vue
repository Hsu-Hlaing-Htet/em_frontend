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
                :value="receipts"
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
                        <p class="m-0 text-md">All Receipts</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]" />
                                <InputText
                                    v-model="search"
                                    placeholder="Search receipt number..."
                                    class="w-72 !pl-10"
                                />
                            </div>
                            <Button label="Reset" @click="resetSearch" />
                        </div>
                    </div>
                </template>

                <template #empty>No receipts found.</template>
                <template #loading>Loading receipts. Please wait.</template>

                <Column field="receipt_number" header="Receipt #" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showReceipt', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.receipt_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="payment_id" header="Payment" :sortable="true" style="min-width: 100px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="issued_at" header="Issued At" :sortable="true" style="min-width: 160px" />
            </DataTable>

            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { useReceiptList } from './useReceiptList';

export default defineComponent({
    name: 'ReceiptList',
    components: { DataTable, Column, InputText, Button, Loading, StatusBadge },
    setup() {
        return useReceiptList();
    },
});
</script>
