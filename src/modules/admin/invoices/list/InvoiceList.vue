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
                :value="invoices"
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
                        title="Issued Invoices"
                        :search="search"
                        search-placeholder="Search invoice number..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="statusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="All Approved"
                            class="w-52"
                        />
                    </AdminListFilters>
                </template>

                <template #empty>No issued invoices found.</template>
                <template #loading>Loading invoices. Please wait.</template>

                <Column field="invoice_number" header="Invoice #" :sortable="true" style="min-width: 150px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showInvoice', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.invoice_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="type" header="Type" :sortable="true" style="min-width: 90px" />
                <Column field="total_amount" header="Total" :sortable="true" style="min-width: 110px" />
                <Column field="due_date" header="Due Date" :sortable="true" style="min-width: 120px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="issued_date" header="Issued" :sortable="true" style="min-width: 120px" />
                <Column field="created_by_name" header="Created By" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ data.created_by_name || '—' }}
                    </template>
                </Column>
                <Column field="approved_by_name" header="Approved By" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ data.approved_by_name || '—' }}
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
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { INVOICE_LIST_STATUS_OPTIONS } from '@/constants/constant';
import { useInvoiceList } from './useInvoiceList';

export default defineComponent({
    name: 'InvoiceList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Loading,
        AdminListFilters,
        StatusBadge,
    },
    setup() {
        const list = useInvoiceList();

        return {
            ...list,
            statusOptions: INVOICE_LIST_STATUS_OPTIONS,
        };
    },
});
</script>
