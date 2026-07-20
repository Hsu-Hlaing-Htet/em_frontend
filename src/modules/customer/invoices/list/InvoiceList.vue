<template>
    <div class="admin-panel">
        <DataTable
            :value="invoices"
            data-key="id"
            :loading="isLoading"
            :lazy="true"
            :paginator="true"
            :rows="rows"
            :first="first"
            :total-records="totalRecords"
            @page="onPage"
        >
            <template #empty>No invoices found.</template>
            <Column field="invoice_number" header="Invoice #" />
            <Column field="type" header="Type" />
            <Column field="total_amount" header="Total" />
            <Column field="paid_amount" header="Paid" />
            <Column field="due_date" header="Due Date" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <StatusBadge :value="data.status" />
                </template>
            </Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <Button label="View" text @click="openInvoice(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useCustomerInvoiceList from '@/composables/customer/useCustomerInvoiceList';

export default defineComponent({
    name: 'CustomerInvoiceList',
    components: { Button, StatusBadge },
    setup() {
        return useCustomerInvoiceList();
    },
});
</script>
