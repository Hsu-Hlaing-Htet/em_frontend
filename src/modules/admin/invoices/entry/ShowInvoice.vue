<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <Button
            v-if="canIssue()"
            label="Issue Invoice"
            icon="pi pi-send"
            :loading="isIssuing"
            @click="handleIssue"
        />
        <router-link :to="{ name: 'invoiceList' }">
            <Button label="Back" />
        </router-link>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-5xl">
        <div class="mb-4 flex items-center gap-3">
            <h2 class="m-0 text-lg font-semibold">{{ state.invoice_number }}</h2>
            <StatusBadge :value="state.status" />
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Type</p>
                <p class="text-sm">{{ state.type }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Issued / Due</p>
                <p class="text-sm">{{ state.issued_date || '—' }} / {{ state.due_date || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Total</p>
                <p class="text-sm font-medium">{{ state.total_amount }}</p>
            </div>
        </div>

        <h3 class="mb-3 text-md font-medium">Line Items</h3>
        <DataTable :value="state.items" data-key="id" class="mb-8">
            <Column field="description" header="Description" />
            <Column field="charge_type_name" header="Charge Type" />
            <Column field="amount" header="Amount" />
        </DataTable>

        <h3 class="mb-3 text-md font-medium">Payment Timeline</h3>
        <Timeline v-if="payments.length" :value="payments">
            <template #content="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="font-medium">{{ item.amount }}</span>
                    <StatusBadge :value="item.status" />
                    <span class="text-sm text-[var(--admin-text-muted)]">{{ item.payment_date }}</span>
                    <span v-if="item.payment_method_name" class="text-sm">via {{ item.payment_method_name }}</span>
                </div>
            </template>
        </Timeline>
        <p v-else class="text-sm text-[var(--admin-text-muted)]">No payments recorded yet.</p>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Timeline from 'primevue/timeline';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import useShowInvoice from './useShowInvoice';

export default defineComponent({
    name: 'ShowInvoice',
    components: { DataTable, Column, Timeline, Button, Loading, StatusBadge },
    setup() {
        return useShowInvoice();
    },
});
</script>
