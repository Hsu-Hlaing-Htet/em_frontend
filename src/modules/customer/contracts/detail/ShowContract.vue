<template>
    <div v-if="!isLoading" class="admin-panel mx-auto max-w-5xl">
        <div class="mb-4 flex justify-end gap-2">
            <Button label="Download PDF" icon="pi pi-download" :loading="isDownloading" @click="downloadPdf" />
            <router-link :to="{ name: 'customerContractList' }">
                <Button label="Back" severity="secondary" />
            </router-link>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><strong>Contract #</strong><p>{{ state.contract_number }}</p></div>
            <div><strong>Type</strong><p class="capitalize">{{ state.type }}</p></div>
            <div><strong>Status</strong><p><StatusBadge :value="state.status" /></p></div>
            <div><strong>Building</strong><p>{{ state.building_name || '—' }}</p></div>
            <div><strong>Room</strong><p>{{ state.room_number || '—' }}</p></div>
            <div><strong>Total</strong><p>{{ state.contract_total || '—' }}</p></div>
            <div><strong>Deposit</strong><p>{{ state.deposit_amount || '—' }}</p></div>
            <div><strong>Start Date</strong><p>{{ state.start_date || '—' }}</p></div>
            <div><strong>End Date</strong><p>{{ state.end_date || '—' }}</p></div>
            <div><strong>Payment Type</strong><p>{{ state.payment_type || '—' }}</p></div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import useCustomerShowContract from '@/composables/customer/useCustomerShowContract';

export default defineComponent({
    name: 'CustomerShowContract',
    components: { Button, StatusBadge, Loading },
    setup() {
        return useCustomerShowContract();
    },
});
</script>
