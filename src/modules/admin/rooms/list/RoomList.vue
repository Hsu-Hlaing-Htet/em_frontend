<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative room-list-panel">
            <DataTable
                ref="dt"
                class="room-list-table admin-clickable-rows"
                data-key="id"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :current-page-report-template="$t('common.showingEntries')"
                sort-mode="multiple"
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
                row-hover
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
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

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-th-large"
                        :title="$t('property.noRooms')"
                        message="Create a room or adjust your search and filters."
                    />
                </template>
                <template #loading>{{ $t('property.loadingRooms') }}</template>

                <Column selection-mode="multiple" header-style="width: 3rem" style="width: 3rem" />

                <Column field="room_number" header="Room No" :sortable="true">
                    <template #body="{ data }">
                        <router-link
                            :to="{ name: 'showRoom', params: { id: data.id } }"
                            class="font-medium text-[var(--admin-primary)] hover:underline"
                        >
                            {{ data.room_number }}
                        </router-link>
                    </template>
                </Column>

                <Column field="building_name" header="Building" :sortable="true">
                    <template #body="{ data }">
                        {{ data.building_name || data.building?.building_name || '—' }}
                    </template>
                </Column>

                <Column field="floor_number" header="Floor" :sortable="true">
                    <template #body="{ data }">
                        {{ data.floor_number }}
                    </template>
                </Column>

                <Column field="area_sqft" header="Area (sqft)" :sortable="true">
                    <template #body="{ data }">
                        {{ data.area_sqft }}
                    </template>
                </Column>

                <Column field="type" header="Room Type" :sortable="true">
                    <template #body="{ data }">
                        {{ formatRoomType(data.type) }}
                    </template>
                </Column>

                <Column field="status" header="Status" :sortable="true">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>

                <Column header="Price (MMK)">
                    <template #body="{ data }">
                        {{ formatRoomListPrice(data) }}
                    </template>
                </Column>

                <Column header="Actions" :exportable="false" style="width: 7rem">
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
                            @click="showConfirmDialog(data.id, data.room_number)"
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
import Dropdown from '@/components/global/AppDropdown.vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useRoomList } from './useRoomList';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';

export default defineComponent({
    name: 'RoomList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Button,
        Loading,
        StatusBadge,
        ListExportActions,
        AdminListFilters,
    },
    setup() {
        return useRoomList();
    },
});
</script>

<style scoped>
.room-list-panel {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
}

:deep(.room-list-table .p-datatable-wrapper) {
    overflow-x: auto;
}

:deep(.room-list-table .p-datatable-table) {
    width: 100%;
    table-layout: auto;
}

:deep(.room-list-table .p-datatable-thead > tr > th),
:deep(.room-list-table .p-datatable-tbody > tr > td) {
    white-space: nowrap;
    vertical-align: middle;
}
</style>
