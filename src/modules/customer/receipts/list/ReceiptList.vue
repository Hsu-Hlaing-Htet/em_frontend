<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header">
            <h1 class="customer-page-heading">{{ $t('customer.receipts') }}</h1>
            <p class="customer-page-lead">{{ $t('customer.receiptsLead') }}</p>
        </header>

        <Loading v-if="isLoading" />

        <div v-else-if="receipts.length" class="customer-record-list">
            <article
                v-for="receipt in receipts"
                :key="receipt.id"
                class="customer-record-row customer-receipt-row"
            >
                <button type="button" class="customer-receipt-main" @click="openReceipt(receipt.id)">
                    <span class="customer-record-cell customer-record-primary">
                        <span class="customer-record-label">{{ $t('customer.receipt') }}</span>
                        <strong>{{ receipt.receipt_number || '—' }}</strong>
                        <small>{{ $t('customer.invoice') }} {{ receipt.invoice_number || '—' }}</small>
                    </span>
                    <span class="customer-record-cell customer-record-amount">
                        <span class="customer-record-label">{{ $t('customer.amount') }}</span>
                        <strong>{{ formatCurrency(Number(receipt.payment_amount || 0)) }}</strong>
                    </span>
                    <span class="customer-record-cell">
                        <span class="customer-record-label">{{ $t('customer.paymentDate') }} / {{ $t('customer.method') }}</span>
                        <strong>{{ receipt.payment_date || '—' }}</strong>
                        <small>{{ receipt.payment_method_name || '—' }}</small>
                    </span>
                    <span class="customer-record-status">
                        <span class="customer-record-label">{{ $t('customer.status') }}</span>
                        <StatusBadge :value="receipt.status" />
                    </span>
                </button>
                <Button
                    icon="pi pi-download"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    :loading="downloadingReceiptId === receipt.id"
                    :aria-label="$t('customer.downloadReceipt')"
                    class="customer-record-download"
                    @click="downloadReceipt(receipt)"
                />
            </article>

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
            icon="pi pi-receipt"
            :title="$t('customer.noReceiptsTitle')"
            :message="$t('customer.noReceiptsMessage')"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerReceiptList from '@/composables/customer/useCustomerReceiptList';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerReceiptList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerEmptyState,
    },
    setup() {
        return { ...useCustomerReceiptList(), formatCurrency };
    },
});
</script>
