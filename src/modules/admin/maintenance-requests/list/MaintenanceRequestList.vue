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
                :value="maintenanceRequests"
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
                        <p class="m-0 text-md">All Maintenance Requests</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]" />
                                <InputText
                                    v-model="search"
                                    placeholder="Search title..."
                                    class="w-72 !pl-10"
                                />
                            </div>
                            <Dropdown
                                v-model="statusFilter"
                                :options="statusOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="Status"
                                show-clear
                                class="w-44"
                            />
                            <Button label="Reset" @click="resetSearch" />
                            <router-link :to="{ name: 'newMaintenanceRequest' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No maintenance requests found.</template>
                <template #loading>Loading maintenance requests. Please wait.</template>

                <Column field="title" header="Title" :sortable="true" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showMaintenanceRequest', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.title }}
                        </router-link>
                    </template>
                </Column>
                <Column field="room_number" header="Room" :sortable="true" style="min-width: 100px" />
                <Column field="user_name" header="Resident" :sortable="true" style="min-width: 140px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 130px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" header="Created" :sortable="true" style="min-width: 160px" />
                <Column header="Actions" :exportable="false" style="width: 150px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editMaintenanceRequest', params: { id: data.id } }">
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
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { MAINTENANCE_STATUS_OPTIONS } from '@/constants/constant';
import { useMaintenanceRequestList } from './useMaintenanceRequestList';

export default defineComponent({
    name: 'MaintenanceRequestList',
    components: { DataTable, Column, InputText, Dropdown, Button, Loading, StatusBadge },
    setup() {
        const list = useMaintenanceRequestList();

        return {
            ...list,
            statusOptions: MAINTENANCE_STATUS_OPTIONS,
        };
    },
});
</script>
