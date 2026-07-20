<template>
    <div v-if="!isLoading" class="admin-panel mx-auto max-w-4xl">
        <div class="mb-4 flex justify-end gap-2">
            <Button label="Download PDF" icon="pi pi-download" :loading="isDownloading" @click="downloadPdf" />
            <router-link :to="{ name: 'customerReceiptList' }">
                <Button label="Back" severity="secondary" />
            </router-link>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><strong>Receipt #</strong><p>{{ state.receipt_number }}</p></div>
            <div><strong>Invoice #</strong><p>{{ state.invoice_number || '—' }}</p></div>
            <div><strong>Amount</strong><p>{{ state.payment_amount || '—' }}</p></div>
            <div><strong>Payment Date</strong><p>{{ state.payment_date || '—' }}</p></div>
            <div><strong>Method</strong><p>{{ state.payment_method_name || '—' }}</p></div>
            <div><strong>Status</strong><p><StatusBadge :value="state.status" /></p></div>
            <div><strong>Building</strong><p>{{ state.building_name || '—' }}</p></div>
            <div><strong>Room</strong><p>{{ state.room_number || '—' }}</p></div>
            <div><strong>Issued At</strong><p>{{ state.issued_at || '—' }}</p></div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import useCustomerShowReceipt from '@/composables/customer/useCustomerShowReceipt';

export default defineComponent({
    name: 'CustomerShowReceipt',
    components: { Button, StatusBadge, Loading },
    setup() {
        return useCustomerShowReceipt();
    },
});
</script>
