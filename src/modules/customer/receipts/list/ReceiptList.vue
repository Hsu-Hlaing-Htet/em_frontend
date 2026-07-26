<template>
    <div>
        <h1 class="customer-page-heading">Receipts</h1>
        <p class="customer-page-lead">Download and review your payment receipts</p>

        <Loading v-if="isLoading" />

        <div v-else-if="receipts.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="receipt in receipts"
                :key="receipt.id"
                :transaction-id="receipt.receipt_number"
                :title="receipt.invoice_number ? `Invoice ${receipt.invoice_number}` : 'Receipt'"
                :amount="receipt.payment_amount"
                :subtitle="`${receipt.payment_date || '—'} · ${receipt.payment_method_name || '—'}`"
                :status="receipt.status"
                :to="{ name: 'customerShowReceipt', params: { id: receipt.id } }"
            />

            <Button
                v-if="hasMore()"
                label="Load more"
                class="customer-load-more customer-btn-primary"
                :loading="isLoadingMore"
                @click="loadMore"
            />
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-receipt"
            title="No receipts yet"
            message="Receipts appear here after payments are approved."
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerReceiptList from '@/composables/customer/useCustomerReceiptList';

export default defineComponent({
    name: 'CustomerReceiptList',
    components: {
        Button,
        Loading,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerReceiptList();
    },
});
</script>
