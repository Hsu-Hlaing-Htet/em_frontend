<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative">
            <DataTable
                ref="dt"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :current-page-report-template="$t('common.showingEntries')"
                responsive-layout="scroll"
                sort-mode="multiple"
                scroll-height="50vh"
                :scrollable="true"
                :lazy="true"
                :paginator="true"
                :value="rooms"
                v-model:selection="selectedRooms"
                :meta-key-selection="false"
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
                        :title="$t('property.allRooms')"
                        :search="search"
                        :search-placeholder="$t('common.keywordSearch')"
                        :reset-label="$t('common.reset')"
                        @update:search="search = $event"
                        @reset="resetSearch"
                    >
                        <Dropdown
                            v-model="selectedBuilding"
                            :options="buildingOptions"
                            option-label="label"
                            option-value="value"
                            :placeholder="$t('customer.building')"
                            class="w-52"
                        />
                        <Dropdown
                            v-model="selectedType"
                            :options="typeOptions"
                            option-label="label"
                            option-value="value"
                            :placeholder="$t('property.roomType')"
                            class="w-40"
                        />
                        <Dropdown
                            v-model="selectedStatus"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            :placeholder="$t('property.roomStatus')"
                            class="w-40"
                        />
                        <template #actions>
                            <router-link :to="{ name: 'newRoom' }">
                                <Button :label="$t('common.create')" />
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
                        <template #selection>
                            <div
                                v-if="selectedRoomCount"
                                class="admin-selection-bar"
                            >
                                <span class="text-sm font-semibold text-[var(--admin-text)]">
                                    {{ selectedRoomCount }} selected
                                </span>

                                <button
                                    type="button"
                                    class="admin-selection-delete"
                                    :disabled="!canBulkDelete"
                                    :title="canBulkDelete ? '' : 'Only available rooms without contract history can be deleted'"
                                    @click="showBulkDeleteConfirmDialog"
                                >
                                    <i class="pi pi-trash" />
                                    Delete
                                </button>
                            </div>
                        </template>
                    </AdminListFilters>
                </template>
                <template #empty>{{ $t('property.noRooms') }}</template>
                <template #loading>{{ $t('property.loadingRooms') }}</template>

                <Column selection-mode="multiple" header-style="width: 3rem" />
                <Column field="building_name" :header="$t('customer.building')" :sortable="true" style="min-width: 70px" />
                <Column field="room_number" :header="$t('property.roomNumber')" :sortable="true" style="min-width: 70px" class="hover:underline">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'showRoom', params: { id: data.id } }">
                            {{ data.room_number }}
                        </router-link>
                    </template>
                </Column>
                <Column field="floor_number" :header="$t('property.floor')" :sortable="true" style="min-width: 70px" />
                <Column field="area_sqft" header="Area (sqft)" :sortable="true" style="min-width: 70px" />
                <Column field="type" :header="$t('property.roomType')" :sortable="true" style="min-width: 70px" />
                <Column field="status" :header="$t('common.status')" :sortable="true" style="min-width: 70px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="sale_price" :header="$t('property.salePrice') + ' (MMK)'" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.sale_price) }}
                    </template>
                </Column>
                <Column field="rent_price" :header="$t('property.rentPrice') + ' (MMK)'" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.rent_price) }}
                    </template>
                </Column>
                <Column field="rent_deposit_price" header="Rent Deposit (MMK)" :sortable="true" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.rent_deposit_price) }}
                    </template>
                </Column>
                <Column field="booking_deposit_price" header="Booking Deposit (MMK)" :sortable="true" style="min-width: 160px">
                    <template #body="{ data }">
                        {{ formatCurrency(data.booking_deposit_price) }}
                    </template>
                </Column>
                <Column
                    :header="$t('common.actions')"
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
                            v-if="data.can_delete"
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            @click="showConfirmDialog(data.id,data.room_number)"
                        />
                        <Button
                            v-else
                            :icon="data.status === 'inactive' ? 'pi pi-refresh' : 'pi pi-ban'"
                            text
                            :severity="data.status === 'inactive' ? 'success' : 'warning'"
                            :title="data.status === 'inactive' ? 'Make available' : 'Mark inactive'"
                            @click="showLifecycleDialog(data)"
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
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useRoomList } from './useRoomList';

export default defineComponent({
    name: 'RoomList',
    components: { DataTable, Column, Dropdown, Button, Loading, StatusBadge, ListExportActions, AdminListFilters },
    setup() {
        return useRoomList();
    },
});
</script>
