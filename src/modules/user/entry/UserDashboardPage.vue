<script setup>
import { onMounted, reactive } from 'vue';
import { getOwnerDashboard } from '@/modules/user/userService';

const data = reactive({
    totals: {},
    invoice_status: {},
});

onMounted(async () => {
    const response = await getOwnerDashboard();
    Object.assign(data, response.data);
});
</script>

<template>
    <div class="rr-layout-columns">
        <div class="rr-col-4 rr-card rr-kpi">
            <p class="rr-kpi-label">My Properties</p>
            <p class="rr-kpi-value">{{ data.totals.properties ?? 0 }}</p>
        </div>
        <div class="rr-col-4 rr-card rr-kpi">
            <p class="rr-kpi-label">My Invoices</p>
            <p class="rr-kpi-value">{{ data.totals.invoices ?? 0 }}</p>
        </div>
        <div class="rr-col-4 rr-card rr-kpi">
            <p class="rr-kpi-label">Payment Records</p>
            <p class="rr-kpi-value">{{ data.totals.payments ?? 0 }}</p>
        </div>
    </div>

    <div class="rr-card" style="margin-top: 1rem; padding: 1rem">
        <p class="rr-title" style="font-size: 0.74rem">Invoice Status</p>
        <p class="rr-muted">Unpaid: {{ data.invoice_status.unpaid ?? 0 }} · Partial: {{ data.invoice_status.partial ?? 0 }} · Paid: {{ data.invoice_status.paid ?? 0 }}</p>
    </div>
</template>
