<template>
    <div v-if="!isLoading">
        <div class="mb-4 flex flex-wrap gap-2">
            <Button
                :label="$t('customer.downloadContract')"
                icon="pi pi-download"
                class="flex-1"
                :loading="isDownloading"
                @click="downloadPdf"
            />
            <router-link :to="{ name: 'customerContractList' }" class="flex-1">
                <Button :label="$t('common.back')" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel p-4">
            <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ $t('customer.contract') }}</p>
                    <h1 class="customer-page-heading m-0">{{ state.contract_number }}</h1>
                </div>
                <StatusBadge :value="state.status" />
            </div>

            <div class="customer-detail-grid">
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.type') }}</p>
                    <p class="customer-detail-value capitalize">{{ state.type || '—' }}</p>
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
                    <p class="customer-detail-label">{{ $t('customer.total') }}</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.contract_total) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.deposit') }}</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.deposit_amount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.startDate') }}</p>
                    <p class="customer-detail-value">{{ state.start_date || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.endDate') }}</p>
                    <p class="customer-detail-value">{{ state.end_date || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">{{ $t('customer.paymentType') }}</p>
                    <p class="customer-detail-value">{{ state.payment_type || '—' }}</p>
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
import useCustomerShowContract from '@/composables/customer/useCustomerShowContract';

export default defineComponent({
    name: 'CustomerShowContract',
    components: { Button, StatusBadge, Loading },
    setup() {
        return {
            ...useCustomerShowContract(),
            formatCurrency,
        };
    },
});
</script>
