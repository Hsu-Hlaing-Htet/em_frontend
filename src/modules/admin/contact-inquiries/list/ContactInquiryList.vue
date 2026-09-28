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
                :value="inquiries"
                :multi-sort-meta="lazyParams.multiSortMeta"
                :total-records="totalRecords"
                :rows="10"
                :first="lazyParams.first"
                :rows-per-page-options="[10, 25, 50]"
                removable-sort
                row-hover
                class="admin-clickable-rows"
                @page="onPage($event)"
                @sort="onSort($event)"
                @row-click="onRowClick"
            >
                <template #header>
                    <AdminListFilters
                        title="Contact Inquiries"
                        :search="search"
                        search-placeholder="Search name, email, phone, or subject..."
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
                            class="w-36"
                        />
                    </AdminListFilters>
                </template>

                <template #empty>
                    <AdminEmptyState
                        icon="pi pi-inbox"
                        title="No contact inquiries found"
                        message="Public contact form submissions will appear here."
                    />
                </template>
                <template #loading>Loading contact inquiries. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 150px" />
                <Column field="email" header="Email" :sortable="true" style="min-width: 180px" />
                <Column field="phone" header="Phone" :sortable="true" style="min-width: 130px" />
                <Column field="preferred_service" header="Service" :sortable="true" style="min-width: 150px" />
                <Column field="subject" header="Subject" :sortable="true" style="min-width: 180px" />
                <Column field="created_at" header="Date" :sortable="true" style="min-width: 150px">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) || '—' }}
                    </template>
                </Column>
                <Column field="status" header="Status" :sortable="true" style="min-width: 110px">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
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
import Loading from '@/components/global/Loading.vue';
import AdminListFilters from '@/components/admin/AdminListFilters.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue';
import { formatDate } from '@/utils/formatter';
import { useContactInquiryList } from './useContactInquiryList';

export default defineComponent({
    name: 'ContactInquiryList',
    components: {
        AdminEmptyState,
        DataTable,
        Column,
        Dropdown,
        Loading,
        AdminListFilters,
        StatusBadge,
    },
    setup() {
        return {
            ...useContactInquiryList(),
            formatDate,
        };
    },
});
</script>
