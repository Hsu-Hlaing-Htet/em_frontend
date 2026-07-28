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
                    <AdminListFilters
                        title="All Receipts"
                        :search="search"
                        search-placeholder="Search receipt number..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="statusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="All Statuses"
                            show-clear
                            class="w-52"
                        />
                    </AdminListFilters>
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
                <Column field="invoice_number" header="Invoice #" :sortable="true" style="min-width: 140px" />
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
import Dropdown from 'primevue/dropdown';
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { RECEIPT_STATUS_OPTIONS } from '@/constants/constant';
import { useReceiptList } from './useReceiptList';

export default defineComponent({
    name: 'ReceiptList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Loading,
        AdminListFilters,
        StatusBadge,
    },
    setup() {
        const list = useReceiptList();

        return {
            ...list,
            statusOptions: RECEIPT_STATUS_OPTIONS,
        };
    },
});
</script>
