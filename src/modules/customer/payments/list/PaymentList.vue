<template>
    <div class="admin-panel">
        <DataTable
            :value="payments"
            data-key="id"
            :loading="isLoading"
            :lazy="true"
            :paginator="true"
            :rows="rows"
            :first="first"
            :total-records="totalRecords"
            @page="onPage"
        >
            <template #empty>No payments found.</template>
            <Column field="payment_date" header="Date" />
            <Column field="invoice_number" header="Invoice" />
            <Column field="amount" header="Amount" />
            <Column field="payment_method_name" header="Method" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <StatusBadge :value="data.status" />
                </template>
            </Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Button label="Invoice" text @click="openInvoice(data.invoice_id)" />
                        <Button
                            v-if="data.receipt_id"
                            label="Receipt"
                            text
                            @click="openReceipt(data.receipt_id)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useCustomerPaymentList from '@/composables/customer/useCustomerPaymentList';

export default defineComponent({
    name: 'CustomerPaymentList',
    components: { Button, StatusBadge },
    setup() {
        return useCustomerPaymentList();
    },
});
</script>
