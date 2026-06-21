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
                :value="users"
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
                        <h2 class="m-0">All Users</h2>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative">
    <i
        class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
    />

    <InputText
        v-model="search"
        placeholder="Keyword search"
        class="w-72 !pl-10"
    />
</div>
                            <Button label="Reset" class="p-button-outlined p-button-secondary" @click="resetSearch" />
                            <router-link :to="{ name: 'newUser' }">
                                <Button label="Create" class="admin-crud-primary-btn pi pi-plus-" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No users found.</template>
                <template #loading>Loading users. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 180px">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'showUser', params: { id: data.id } }" class="no-underline hover:underline">
                            {{ data.name }}
                        </router-link>
                    </template>
                </Column>
                <Column field="email" header="Email" :sortable="true" style="min-width: 220px" />
                <Column field="role_name" header="Role" :sortable="true" style="min-width: 140px" />
                <Column field="created_at" header="Created" :sortable="true" style="min-width: 180px" />
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
import { useUserList } from './useUserList';

export default defineComponent({
    name: 'UserList',
    components: { DataTable, Column, InputText, Button, Loading },
    setup() {
        return useUserList();
    },
});
</script>
