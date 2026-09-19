<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.receipts')"
            :subtitle="$t('customer.receiptsLead')"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="receipts.length" class="customer-record-list">
            <button
                v-for="receipt in receipts"
                :key="receipt.id"
                type="button"
                class="customer-record-row customer-receipt-row"
                @click="openReceipt(receipt.id)"
            >
                <span class="customer-record-cell customer-record-primary">
                    <strong>{{ receipt.receipt_number || receipt.id || '—' }}</strong>
                </span>
                <span class="customer-record-cell customer-record-meta">
                    <time>{{ receipt.receipt_date || receipt.payment_date || '—' }}</time>
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
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerReceiptList from '@/composables/customer/useCustomerReceiptList';

export default defineComponent({
    name: 'CustomerReceiptList',
    components: {
        Button,
        Loading,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return useCustomerReceiptList();
    },
});
</script>
