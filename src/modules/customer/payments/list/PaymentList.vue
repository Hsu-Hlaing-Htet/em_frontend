<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.payments')"
            :subtitle="$t('customer.paymentsLead')"
        />

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            class="customer-list-toolbar"
            :placeholder="$t('customer.paymentSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="payments.length" class="customer-record-list">
            <button
                v-for="payment in payments"
                :key="payment.id"
                type="button"
                class="customer-record-row customer-payment-row"
                @click="openPayment(payment)"
            >
                <span class="customer-record-cell customer-record-primary">
                    <strong>{{ payment.invoice_number || $t('customer.invoicePayment') }}</strong>
                    <small>{{ $t('customer.paymentAmount') }} (MMK) {{ formatCurrency(Number(payment.amount || 0)) }}</small>
                    <small>{{ payment.payment_method_name || $t('customer.methodPending') }}</small>
                </span>

                <span class="customer-record-cell customer-record-meta">
                    <strong>{{ payment.payment_date || '—' }}</strong>
                    <StatusBadge :value="payment.status" />
                </span>
            </button>

            <Button
                v-if="hasMore()"
                :label="$t('common.loadMore')"
                class="customer-load-more btn"
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
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerSearchBar from '@/components/customer/CustomerSearchBar.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerPaymentList from '@/composables/customer/useCustomerPaymentList';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerPaymentList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerSearchBar,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return {
            ...useCustomerPaymentList(),
            formatCurrency,
        };
    },
});
</script>
