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
                :value="utilities"
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
                        title="All Utilities"
                        :search="search"
                        search-placeholder="Search room, billing month..."
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

                        <template #actions>
                            <router-link :to="{ name: 'newUtility' }">
                                <Button label="Create" />
                            </router-link>
                        </template>
                    </AdminListFilters>
                </template>

                <template #empty>No utility records found.</template>
                <template #loading>Loading utilities. Please wait.</template>

     
    <Column field="customer_name" header="Customer" :sortable="true" style="min-width: 120px" />
    <Column field="room_number" header="Room" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showUtility', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.room_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="total_amount" header="Total" :sortable="true" style="min-width: 110px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_by" header="Created By" :sortable="true" style="min-width: 120px" />
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 160px" />
                <Column header="Actions" :exportable="false" style="width: 150px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editUtility', params: { id: data.id } }">
                            <Button icon="pi pi-pencil" text severity="info" />
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
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { UTILITY_STATUS_OPTIONS } from '@/constants/constant';
import { useUtilityList } from './useUtilityList';

export default defineComponent({
    name: 'UtilityList',
    components: {
        DataTable,
        Column,
        Dropdown,
        Button,
        Loading,
        AdminListFilters,
        StatusBadge,
    },
    setup() {
        const list = useUtilityList();

        return {
            ...list,
            statusOptions: UTILITY_STATUS_OPTIONS,
        };
    },
});
</script>
