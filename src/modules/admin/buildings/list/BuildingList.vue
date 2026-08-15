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
                :value="buildings"
                v-model:selection="selectedBuildings"
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
                    <div class="admin-list-toolbar admin-list-toolbar--selection">
                        <p class="admin-list-toolbar__title">{{ $t('property.allBuildings') }}</p>


                        <div class="admin-list-toolbar__controls">
                            <div class="admin-list-toolbar__search">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                                />

                                <InputText
                                    v-model="search"
                                    :placeholder="$t('common.keywordSearch')"
                                    class="w-full !pl-10"
                                />
                            </div>

                            <Button
                                :label="$t('common.reset')"
                                @click="resetSearch"
                            />
                            <router-link :to="{ name: 'newBuilding' }">
                                <Button :label="$t('common.create')" />
                            </router-link>

                            <ListExportActions
                                :loading="isExporting"
                                :disabled="!canExport"
                                @download="downloadList"
                                @export-csv="exportCsv"
                                @print="printList"
                            />
                        </div>
                        <div
                            v-if="selectedBuildingCount"
                            class="admin-selection-bar"
                        >
                            <span class="text-sm font-semibold text-[var(--admin-text)]">
                                {{ selectedBuildingCount }} selected
                            </span>

                            <button
                                type="button"
                                class="admin-selection-delete"
                                :disabled="!canBulkDelete"
                                :title="canBulkDelete ? '' : 'Only empty buildings can be deleted'"
                                @click="showBulkDeleteConfirmDialog"
                            >
                                <i class="pi pi-trash" />
                                Delete
                            </button>
                        </div>

                    </div>
                </template>

                <template #empty>{{ $t('property.noBuildings') }}</template>
                <template #loading>{{ $t('property.loadingBuildings') }}</template>

                <Column selection-mode="multiple" header-style="width: 3rem" />
                <Column field="building_name" :header="$t('property.buildingName')" :sortable="true" style="min-width: 200px">
                    <template #body="{ data }">
                        <router-link
    :to="{ name: 'showBuilding', params: { id: data.id } }"
    class="font-medium text-[var(--admin-primary)] hover:underline"
>
    {{ data.building_name }}
</router-link>
                    </template>
                </Column>

                <Column field="location" :header="$t('property.location')" :sortable="true" style="min-width: 180px" />
                <Column field="description" :header="$t('property.description')" :sortable="true" style="min-width: 220px">
                    <template #body="{ data }">
                        <span class="line-clamp-2">{{ data.description || '—' }}</span>
                    </template>
                </Column>
                <Column field="status" :header="$t('common.status')" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column field="created_at" :header="$t('common.createdAt')" :sortable="true" style="min-width: 180px" />
                <Column
                                :header="$t('common.actions')"
                                :exportable="false"
                                style="width: 150px"
                            >   
                    <template #body="{ data }">
                        <router-link
            :to="{ name: 'editBuilding', params: { id: data.id } }"
        >
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
            @click="showConfirmDialog(data.id, data.building_name)"
        />
        <Button
            v-else
            :icon="data.status === 'archived' ? 'pi pi-refresh' : 'pi pi-ban'"
            text
            :severity="data.status === 'archived' ? 'success' : 'warning'"
            :title="data.status === 'archived' ? 'Reactivate' : 'Archive'"
            @click="showArchiveDialog(data)"
        />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ListExportActions from '@/components/admin/ListExportActions.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { useBuildingList } from './useBuildingList';

export default defineComponent({
    name: 'BuildingList',
    components: { DataTable, Column, InputText, Button, ListExportActions, StatusBadge },
    setup() {
        return useBuildingList();
    },
});
</script>
