<template>
    <div class="admin-panel">
        <DataTable
            :value="receipts"
            data-key="id"
            :loading="isLoading"
            :lazy="true"
            :paginator="true"
            :rows="rows"
            :first="first"
            :total-records="totalRecords"
            @page="onPage"
        >
            <template #empty>No receipts found.</template>
            <Column field="receipt_number" header="Receipt #" />
            <Column field="invoice_number" header="Invoice" />
            <Column field="payment_amount" header="Amount" />
            <Column field="payment_date" header="Payment Date" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <StatusBadge :value="data.status" />
                </template>
            </Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <Button label="View" text @click="openReceipt(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useCustomerReceiptList from '@/composables/customer/useCustomerReceiptList';

export default defineComponent({
    name: 'CustomerReceiptList',
    components: { Button, StatusBadge },
    setup() {
        return useCustomerReceiptList();
    },
});
</script>
