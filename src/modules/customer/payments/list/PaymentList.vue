<template>
    <div>
        <h1 class="customer-page-heading">Payments</h1>
        <p class="customer-page-lead">Track your payment history and status</p>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            placeholder="Search by invoice, method, or note"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="payments.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="payment in payments"
                :key="payment.id"
                :transaction-id="payment.payment_number"
                :title="payment.invoice_number || 'Invoice payment'"
                :amount="payment.amount"
                :subtitle="`${payment.payment_date || '—'} · ${payment.payment_method_name || 'Method pending'}`"
                :status="payment.status"
                @select="openPayment(payment)"
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
            icon="pi pi-wallet"
            title="No payments found"
            message="Try changing your search or filter."
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import CustomerSearchBar from '@/components/customer/CustomerSearchBar.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerPaymentList from '@/composables/customer/useCustomerPaymentList';

export default defineComponent({
    name: 'CustomerPaymentList',
    components: {
        Button,
        Loading,
        CustomerSearchBar,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerPaymentList();
    },
});
</script>
