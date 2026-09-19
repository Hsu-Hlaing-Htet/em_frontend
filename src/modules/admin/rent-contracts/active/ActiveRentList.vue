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
                row-hover
                class="admin-clickable-rows"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="Rent Contracts"
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
                        <Dropdown
                            v-model="selectedStatus"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Status"
                            class="w-44"
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

             

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-home"
                        title="No active rents found"
                        message="No active rent contracts match your current filters."
                    />
                </template>
                <template #loading>Loading active rents. Please wait.</template>

                <Column field="contract_no" header="Contract No" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showActiveRent', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.contract_no }}
                        </router-link>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 140px" />
                <Column field="building_name" header="Building" :sortable="true" style="min-width: 140px" />
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="contract_total" header="Contract Total (MMK)" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.contract_total) }}
                    </template>
                </Column>
                <Column field="paid_amount" header="Paid Amount (MMK)" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.paid_amount) }}
                    </template>
                </Column>
                <Column field="remaining_amount" header="Remaining Amount (MMK)" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.remaining_amount) }}
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-1">
                            <span>{{ formatDate(data.created_at) || '—' }}</span>
                            <span class="text-sm text-[var(--admin-text-muted)]">
                                {{ getPaymentTypeLabel(data.payment_type) }}
                            </span>
                        </div>
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
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { ACTIVE_SALE_STATUS_OPTIONS, PAYMENT_PLAN_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { formatDate } from '@/utils/formatter';
import { useActiveRentList } from './useActiveRentList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'ActiveRentList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Calendar,
        Button,
        Loading,
        StatusBadge,
        ListExportActions,
        AdminListFilters,
    },
    setup() {
        const list = useActiveRentList();

        return {
            ...list,
            formatDate,
            paymentTypeOptions: PAYMENT_PLAN_TYPE_FILTER_OPTIONS,
            statusOptions: ACTIVE_SALE_STATUS_OPTIONS,
        };
    },
});
</script>
