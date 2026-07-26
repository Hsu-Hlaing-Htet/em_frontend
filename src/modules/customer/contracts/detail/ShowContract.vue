<template>
    <div v-if="!isLoading">
        <div class="mb-4 flex flex-wrap gap-2">
            <Button
                label="Download Contract"
                icon="pi pi-download"
                class="flex-1"
                :loading="isDownloading"
                @click="downloadPdf"
            />
            <router-link :to="{ name: 'customerContractList' }" class="flex-1">
                <Button label="Back" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel p-4">
            <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">Contract</p>
                    <h1 class="customer-page-heading m-0">{{ state.contract_number }}</h1>
                </div>
                <StatusBadge :value="state.status" />
            </div>

            <div class="customer-detail-grid">
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Type</p>
                    <p class="customer-detail-value capitalize">{{ state.type || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Building</p>
                    <p class="customer-detail-value">{{ state.building_name || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Room</p>
                    <p class="customer-detail-value">{{ state.room_number || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Total</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.contract_total) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Deposit</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.deposit_amount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Start Date</p>
                    <p class="customer-detail-value">{{ state.start_date || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">End Date</p>
                    <p class="customer-detail-value">{{ state.end_date || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Payment Type</p>
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
