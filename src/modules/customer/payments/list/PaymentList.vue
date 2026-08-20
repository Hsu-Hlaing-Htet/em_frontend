<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header">
            <h1 class="customer-page-heading">{{ $t('customer.payments') }}</h1>
            <p class="customer-page-lead">{{ $t('customer.paymentsLead') }}</p>
        </header>

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
                    <span class="customer-record-label">{{ $t('customer.invoice') }} / {{ $t('customer.reference') }}</span>
                    <strong>{{ payment.invoice_number || $t('customer.invoicePayment') }}</strong>
                    <small>{{ payment.note || payment.reference_number || '—' }}</small>
                </span>

                <span class="customer-record-cell customer-record-amount">
                    <span class="customer-record-label">{{ $t('customer.amount') }}</span>
                    <strong>{{ formatCurrency(Number(payment.amount || 0)) }}</strong>
                </span>

                <span class="customer-record-cell">
                    <span class="customer-record-label">{{ $t('customer.paymentDate') }} / {{ $t('customer.method') }}</span>
                    <strong>{{ payment.payment_date || '—' }}</strong>
                    <small>{{ payment.payment_method_name || $t('customer.methodPending') }}</small>
                </span>

                <span class="customer-record-status">
                    <span class="customer-record-label">{{ $t('customer.status') }}</span>
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
import useCustomerPaymentList from '@/composables/customer/useCustomerPaymentList';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerPaymentList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerSearchBar,
        CustomerEmptyState,
    },
    setup() {
        return {
            ...useCustomerPaymentList(),
            formatCurrency,
        };
    },
});
</script>
