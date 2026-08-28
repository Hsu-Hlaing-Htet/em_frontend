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
                        title="Rent Contract Approvals"
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
                            <router-link :to="{ name: 'newRentContractDraft' }">
                                <Button label="Create" />
                            </router-link>
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


                <template #empty>No rent contract drafts found.</template>
                <template #loading>Loading rent drafts. Please wait.</template>

                <Column field="contract_no" header="Contract No" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showRentContractDraft', params: { id: data.id } }"
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
                <Column field="payment_type" header="Payment Plan Type" :sortable="true" style="min-width: 150px">
                    <template #body="{ data }">
                        {{ getPaymentTypeLabel(data.payment_type) }}
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_by" header="Created By" :sortable="true" style="min-width: 130px" />
                <Column field="created_at" header="Created Date" :sortable="true" style="min-width: 120px" />
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
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { PAYMENT_PLAN_TYPE_FILTER_OPTIONS } from '@/constants/constant';
import { useRentDraftList } from './useRentDraftList';

export default defineComponent({
    name: 'RentDraftList',
    components: {
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
        const list = useRentDraftList();

        return {
            ...list,
            paymentTypeOptions: PAYMENT_PLAN_TYPE_FILTER_OPTIONS,
        };
    },
});
</script>
