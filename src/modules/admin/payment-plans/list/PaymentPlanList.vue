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
                :value="paymentPlans"
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
                        <p class="m-0 text-md">All Payment Plans</p>
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

                            <Button
                                label="Reset"
                                @click="resetSearch"
                            />

                            <router-link :to="{ name: 'newPaymentPlan' }">
                                <Button label="Create" />
                            </router-link>
                        </div>
                    </div>
                </template>

                <template #empty>No payment plans found.</template>
                <template #loading>Loading payment plans. Please wait.</template>

                <Column field="name" header="Name" :sortable="true" style="min-width: 180px" />
                <Column field="payment_type" header="Payment Type" :sortable="true" style="min-width: 140px" />
                <Column field="duration_months" header="Duration (Months)" :sortable="true" style="min-width: 150px" />
                <Column field="interest_percentage" header="Interest (%)" :sortable="true" style="min-width: 130px" />
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                    <template #body="{ data }">
                        <InputSwitch
                            :model-value="data.status === 'active'"
                            @update:model-value="(value) => toggleStatus(data, value)"
                        />
                    </template>
                </Column>
                <Column field="created_at" header="Created At" :sortable="true" style="min-width: 180px" />
                <Column
                    header="Actions"
                    :exportable="false"
                    style="width: 150px"
                >
                    <template #body="{ data }">
                        <router-link :to="{ name: 'editPaymentPlan', params: { id: data.id } }">
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
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import { usePaymentPlanList } from './usePaymentPlanList';

export default defineComponent({
    name: 'PaymentPlanList',
    components: { DataTable, Column, InputText, InputSwitch, Button, Loading },
    setup() {
        return usePaymentPlanList();
    },
});
</script>
