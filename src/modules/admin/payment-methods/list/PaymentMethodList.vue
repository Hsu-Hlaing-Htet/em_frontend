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
                :value="paymentMethods"
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
                        title="All Payment Methods"
                        :search="search"
                        search-placeholder="Search name, type..."
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="statusFilter"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Status"
                            show-clear
                            class="w-52"
                        />

                        <template #actions>
                            <router-link :to="{ name: 'newPaymentMethod' }">
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

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-credit-card"
                        title="No payment methods found"
                        message="Create a payment method or adjust your search."
                    />
                </template>
                <template #loading>Loading payment methods. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 200px" />
                <Column field="type" header="Type" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <span class="capitalize">{{ formatType(data.type) }}</span>
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <div class="flex items-center gap-3">
                            <StatusBadge :value="data.status" />
                            <InputSwitch
                                :model-value="data.status === 'active'"
                                @update:model-value="(value) => toggleStatus(data, value)"
                            />
                        </div>
                    </template>
                </Column>
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editPaymentMethod', params: { id: data.id } }">
                            <Button
                                icon="pi pi-pencil"
                                text
                                severity="info"
                            />
                        </router-link>

                        <Button
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
import Dropdown from '@/components/global/AppDropdown.vue';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import { PAYMENT_METHOD_STATUS_OPTIONS } from '@/constants/constant';
import { usePaymentMethodList } from './usePaymentMethodList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'PaymentMethodList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        InputSwitch,
        StatusBadge,
        Button,
        Loading,
        AdminListFilters, ListExportActions },
    setup() {
        const list = usePaymentMethodList();

        const formatType = (type) => {
            if (!type) {
                return '—';
            }

            return String(type).replaceAll('_', ' ');
        };

        return {
            ...list,
            formatType,
            statusOptions: PAYMENT_METHOD_STATUS_OPTIONS,
        };
    },
});
</script>
