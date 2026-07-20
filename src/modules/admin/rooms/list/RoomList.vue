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
                :value="rooms"
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
                        <p class="m-0 text-md">All Rooms</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />

                                <InputText
                                    v-model="search"
                                    placeholder="Search room number, building..."
                                    class="w-72 !pl-10"
                                />
                            </div>

                            <Dropdown
                                v-model="selectedBuilding"
                                :options="buildingOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="All Buildings"
                                class="w-52"
                            />

                            <Dropdown
                                v-model="selectedType"
                                :options="typeOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="All Types"
                                class="w-40"
                            />

                            <Dropdown
                                v-model="selectedStatus"
                                :options="statusOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="All Status"
                                class="w-40"
                            />

                            <Button
                                label="Reset"
                                @click="resetSearch"
                            />

                            <router-link :to="{ name: 'newRoom' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No rooms found.</template>
                <template #loading>Loading rooms. Please wait.</template>

                <Column field="building_name" header="Building" :sortable="true" style="min-width: 70px" />
                <Column field="room_number" header="Room Number" :sortable="true" style="min-width: 70px" class="hover:underline">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'showRoom', params: { id: data.id } }">
                            {{ data.room_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="floor_number" header="Floor" :sortable="true" style="min-width: 70px" />
                <Column field="area_sqft" header="Area (sqft)" :sortable="true" style="min-width: 70px" />
                <Column field="type" header="Type" :sortable="true" style="min-width: 70px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 70px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="sale_price" header="Sale Price" :sortable="true" style="min-width: 70px" />
                <Column field="rent_price" header="Rent Price" :sortable="true" style="min-width: 70px" />
                <Column field="rent_deposit_price" header="Rent Deposit" :sortable="true" style="min-width: 70px" />
                <Column field="booking_deposit_price" header="Booking Deposit" :sortable="true" style="min-width: 100px" />
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editRoom', params: { id: data.id } }">
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
                            @click="showConfirmDialog(data.id,data.room_number)"
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
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useRoomList } from './useRoomList';

export default defineComponent({
    name: 'RoomList',
    components: { DataTable, Column, InputText, Button, Loading, StatusBadge },
    setup() {
        return useRoomList();
    },
});
</script>
