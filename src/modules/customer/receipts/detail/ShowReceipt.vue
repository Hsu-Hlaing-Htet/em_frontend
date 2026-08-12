<template>
    <div v-if="!isLoading">
        <div class="mb-4 flex flex-wrap gap-2">
            <Button
                :label="$t('customer.downloadReceipt')"
                icon="pi pi-download"
                class="flex-1"
                :loading="isDownloading"
                @click="downloadPdf"
            />
            <router-link :to="{ name: 'customerReceiptList' }" class="flex-1">
                <Button :label="$t('common.back')" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel p-4">
            <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ $t('customer.receipt') }}</p>
                    <h1 class="customer-page-heading m-0">{{ state.receipt_number }}</h1>
                </div>
                <StatusBadge :value="state.status" />
            </div>

            <div class="customer-detail-grid">
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.invoice') }}</p>
                    <p class="customer-detail-value">{{ state.invoice_number || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.paymentMethod') }}</p>
                    <p class="customer-detail-value">{{ state.payment_method_name || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.amount') }}</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.payment_amount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.paymentDate') }}</p>
                    <p class="customer-detail-value">{{ state.payment_date || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.building') }}</p>
                    <p class="customer-detail-value">{{ state.building_name || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.room') }}</p>
                    <p class="customer-detail-value">{{ state.room_number || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.issuedAt') }}</p>
                    <p class="customer-detail-value">{{ state.issued_at || '—' }}</p>
                </div>
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import { formatCurrency } from '@/utils/formatter';
import useCustomerShowReceipt from '@/composables/customer/useCustomerShowReceipt';

export default defineComponent({
    name: 'CustomerShowReceipt',
    components: { Button, StatusBadge, Loading },
    setup() {
        return {
            ...useCustomerShowReceipt(),
            formatCurrency,
        };
    },
});
</script>
