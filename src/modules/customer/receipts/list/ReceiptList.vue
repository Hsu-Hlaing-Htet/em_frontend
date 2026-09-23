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
                class="customer-interactive-surface customer-record-row customer-receipt-row"
                @click="openReceipt(receipt.id)"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-receipt-identity">
                        <span
                            class="customer-receipt-icon"
                            aria-hidden="true"
                        >
                            <i class="pi pi-receipt" />
                        </span>
                        <span class="customer-receipt-copy">
                            <strong v-if="receipt.receipt_number || receipt.id">
                                {{ $t('customer.receipt') }} {{ receipt.receipt_number || receipt.id }}
                            </strong>
                            <small v-if="receipt.invoice_number">
                                {{ $t('customer.invoice') }} {{ receipt.invoice_number }}
                            </small>
                        </span>
                    </span>
                </span>

                <span class="customer-record-cell customer-record-meta">
                    <time
                        v-if="createdAtParts(receipt.created_at)"
                        class="customer-record-created rw-date"
                        :datetime="receipt.created_at"
                    >
                        <span class="customer-record-created-date">{{ createdAtParts(receipt.created_at).date }}</span>
                        <span class="customer-record-created-sep" aria-hidden="true"> · </span>
                        <span class="customer-record-created-time">{{ createdAtParts(receipt.created_at).time }}</span>
                    </time>
                    <span class="customer-receipt-action">
                        {{ $t('common.view') }} →
                    </span>
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
import { formatCustomerDateTimeParts } from '@/helpers/customer/datetime';

export default defineComponent({
    name: 'CustomerReceiptList',
    components: {
        Button,
        Loading,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return {
            ...useCustomerReceiptList(),
            createdAtParts: formatCustomerDateTimeParts,
        };
    },
});
</script>
