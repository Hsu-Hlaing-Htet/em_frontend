<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-panel relative">
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
                :value="profiles"
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
                        <h2 class="m-0">All Profiles</h2>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="search" placeholder="Keyword search" />
                            </span>
                            <Button label="Reset" class="p-button-outlined p-button-secondary" @click="resetSearch" />
                            <router-link :to="{ name: 'newProfile' }">
                                <Button label="Create" class="admin-crud-primary-btn" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No profiles found.</template>
                <template #loading>Loading profiles. Please wait.</template>

                <Column field="user_name" header="User" :sortable="true" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'showProfile', params: { id: data.id } }" class="no-underline hover:underline">
                            {{ data.user_name }}
                        </router-link>
                    </template>
                </Column>
                <Column field="phone" header="Phone" :sortable="true" style="min-width: 140px" />
                <Column field="nrc" header="NRC" :sortable="true" style="min-width: 160px" />
                <Column field="gender" header="Gender" :sortable="true" style="min-width: 120px" />
                <Column field="dob" header="Date of Birth" :sortable="true" style="min-width: 140px" />
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
import Loading from '@/components/Loading.vue';
import { useProfileList } from './useProfileList';

export default defineComponent({
    name: 'ProfileList',
    components: { DataTable, Column, InputText, Button, Loading },
    setup() {
        return useProfileList();
    },
});
</script>
