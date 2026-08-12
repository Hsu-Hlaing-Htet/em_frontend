<template>
    <div>
        <h1 class="customer-page-heading">{{ $t('customer.payments') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.paymentsLead') }}</p>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            :placeholder="$t('customer.paymentSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="payments.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="payment in payments"
                :key="payment.id"
                :transaction-id="payment.invoice_number"
                :title="payment.invoice_number || $t('customer.invoicePayment')"
                :amount="payment.amount"
                :subtitle="`${payment.payment_date || '—'} · ${payment.payment_method_name || $t('customer.methodPending')}`"
                :status="payment.status"
                @select="openPayment(payment)"
            />

            <Button
                v-if="hasMore()"
                :label="$t('common.loadMore')"
                class="customer-load-more customer-btn-primary"
                :loading="isLoadingMore"
                @click="loadMore"
            />
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-wallet"
            :title="$t('customer.noPaymentsTitle')"
            :message="$t('customer.noPaymentsMessage')"
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
