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
                :pt="clickableRowsPt"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="Invoice Approvals"
                        :search="search"
                        search-placeholder="Search invoice # or customer..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
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
                        <div class="admin-filter-group admin-filter-group--dates">
                            <Calendar
                                v-model="dateFrom"
                                placeholder="From"
                                date-format="dd/mm/yy"
                                show-icon
                                class="w-40"
                            />
                            <Calendar
                                v-model="dateTo"
                                placeholder="To"
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
                        title="No pending invoices"
                        message="There are no invoices waiting for approval."
                    />
                </template>
                <template #loading>Loading pending approvals. Please wait.</template>

                <Column
                    field="invoice_number"
                    header="Invoice #"
                    :sortable="true"
                    style="min-width: 7.5rem; width: 7.5rem"
                />

                <Column
                    field="customer_name"
                    header="Customer"
                    :sortable="true"
                    style="min-width: 8.5rem; width: 11rem"
                >
                    <template #body="{ data }">
                        <span class="admin-contract-party-names">{{ data.customer_name || '—' }}</span>
                    </template>
                </Column>

                <Column
                    field="building_name"
                    header="Building"
                    :sortable="true"
                    style="min-width: 8rem; width: 9.5rem"
                />

                <Column
                    field="room_number"
                    header="Room"
                    :sortable="true"
                    style="min-width: 4.5rem; width: 5rem"
                />

                <Column
                    field="total_amount"
                    header="Total (MMK)"
                    :sortable="true"
                    style="min-width: 7rem; width: 7.5rem"
                >
                    <template #body="{ data }">
                        {{ formatCurrency(invoiceTotal(data)) }}
                    </template>
                </Column>

                <Column
                    field="due_date"
                    header="Due Date"
                    :sortable="true"
                    style="min-width: 6.5rem; width: 7rem"
                >
                    <template #body="{ data }">
                        {{ formatDate(data.due_date) }}
                    </template>
                </Column>
            </DataTable>

            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';
import { formatCurrencyAmount as formatCurrency, formatDate } from '@/utils/formatter';
import { resolveInvoiceTotal } from '@/helpers/invoices/invoiceDetailHelpers';
import { shouldIgnoreListRowClick } from '@/composables/admin/useClickableListRow';
import { useInvoiceApprovalList } from './useInvoiceApprovalList';

export default defineComponent({
    name: 'InvoiceApprovalList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Loading,
        AdminListFilters,
        ListExportActions,
    },
    setup() {
        const router = useRouter();
        const list = useInvoiceApprovalList();

        const openApprovalDetail = (data) => {
            if (!data?.id) {
                return;
            }

            router.push({
                name: 'invoiceApprovalDocument',
                params: { id: data.id },
            });
        };

        const clickableRowsPt = computed(() => ({
            bodyRow: {
                tabindex: 0,
                onKeydown(event) {
                    if (event.key !== 'Enter' && event.key !== ' ') {
                        return;
                    }

                    if (event.target !== event.currentTarget) {
                        return;
                    }

                    if (shouldIgnoreListRowClick(event)) {
                        return;
                    }

                    const index = Number(event.currentTarget.getAttribute('data-p-index'));
                    const data = list.items.value?.[index];

                    if (!data?.id) {
                        return;
                    }

                    event.preventDefault();
                    openApprovalDetail(data);
                },
            },
        }));

        return {
            ...list,
            clickableRowsPt,
            formatCurrency,
            formatDate,
            invoiceTotal: resolveInvoiceTotal,
        };
    },
});
</script>
