<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.payments')"
            :subtitle="$t('customer.paymentsLead')"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="payments.length" class="customer-record-list">
            <button
                v-for="payment in payments"
                :key="payment.id"
                type="button"
                class="customer-interactive-surface customer-record-row customer-payment-row"
                @click="openPayment(payment)"
            >
                <span class="customer-record-cell customer-record-primary">
                    <strong>
                        <template v-if="payment.invoice_number">
                            {{ $t('customer.invoice') }} {{ payment.invoice_number }}
                        </template>
                        <template v-else>
                            {{ $t('customer.invoicePayment') }}
                        </template>
                    </strong>
                    <strong
                        v-if="hasAmount(payment.amount)"
                        class="customer-payment-amount rw-numeric rw-money"
                    >{{ formatCurrency(Number(payment.amount)) }}</strong>
                    <small v-if="payment.payment_method_name">{{ payment.payment_method_name }}</small>
                </span>

                <span class="customer-record-cell customer-record-meta">
                    <time
                        v-if="createdAtParts(payment.created_at)"
                        class="customer-record-created rw-date"
                        :datetime="payment.created_at"
                    >
                        <span class="customer-record-created-date">{{ createdAtParts(payment.created_at).date }}</span>
                        <span class="customer-record-created-sep" aria-hidden="true"> · </span>
                        <span class="customer-record-created-time">{{ createdAtParts(payment.created_at).time }}</span>
                    </time>
                    <StatusBadge v-if="payment.status" :value="payment.status" />
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
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerPaymentList from '@/composables/customer/useCustomerPaymentList';
import { formatCustomerDateTimeParts } from '@/helpers/customer/datetime';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerPaymentList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        const hasAmount = (value) => value !== null && value !== undefined && value !== '';

        return {
            ...useCustomerPaymentList(),
            formatCurrency,
            createdAtParts: formatCustomerDateTimeParts,
            hasAmount,
        };
    },
});
</script>
