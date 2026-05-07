<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getAdminDashboard } from '@/modules/admin/service';

const loading = ref(false);
const dashboard = reactive({
    totals: {},
    property_status: {},
    invoice_status: {},
    revenue: {},
});

async function load() {
    loading.value = true;

    try {
        const { data } = await getAdminDashboard();
        Object.assign(dashboard, data);
    } finally {
        loading.value = false;
    }
}

onMounted(load);
</script>

<template>
    <div class="rr-layout-columns">
        <div class="rr-col-3 rr-card rr-kpi">
            <p class="rr-kpi-label">Properties</p>
            <p class="rr-kpi-value">{{ dashboard.totals.properties ?? 0 }}</p>
        </div>
        <div class="rr-col-3 rr-card rr-kpi">
            <p class="rr-kpi-label">Owners</p>
            <p class="rr-kpi-value">{{ dashboard.totals.owners ?? 0 }}</p>
        </div>
        <div class="rr-col-3 rr-card rr-kpi">
            <p class="rr-kpi-label">Tenants</p>
            <p class="rr-kpi-value">{{ dashboard.totals.tenants ?? 0 }}</p>
        </div>
        <div class="rr-col-3 rr-card rr-kpi">
            <p class="rr-kpi-label">Invoices</p>
            <p class="rr-kpi-value">{{ dashboard.totals.invoices ?? 0 }}</p>
        </div>
    </div>

    <div class="rr-card" style="margin-top: 1rem; padding: 1rem">
        <PvTabView>
            <PvTabPanel header="Property Status">
                <div class="rr-layout-columns" style="margin-top: 0.3rem">
                    <div class="rr-col-3"><strong>Available:</strong> {{ dashboard.property_status.available ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Reserved:</strong> {{ dashboard.property_status.reserved ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Occupied:</strong> {{ dashboard.property_status.occupied ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Sold:</strong> {{ dashboard.property_status.sold ?? 0 }}</div>
                </div>
            </PvTabPanel>
            <PvTabPanel header="Invoice Status">
                <div class="rr-layout-columns" style="margin-top: 0.3rem">
                    <div class="rr-col-3"><strong>Unpaid:</strong> {{ dashboard.invoice_status.unpaid ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Partial:</strong> {{ dashboard.invoice_status.partial ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Paid:</strong> {{ dashboard.invoice_status.paid ?? 0 }}</div>
                    <div class="rr-col-3"><strong>Overdue:</strong> {{ dashboard.invoice_status.overdue ?? 0 }}</div>
                </div>
            </PvTabPanel>
            <PvTabPanel header="Revenue">
                <div class="rr-layout-columns" style="margin-top: 0.3rem">
                    <div class="rr-col-6"><strong>Total Paid:</strong> {{ dashboard.revenue.total_paid ?? 0 }}</div>
                    <div class="rr-col-6"><strong>Outstanding:</strong> {{ dashboard.revenue.outstanding ?? 0 }}</div>
                </div>
            </PvTabPanel>
        </PvTabView>
    </div>

    <div v-if="loading" style="display: grid; place-items: center; margin-top: 1rem"><PvProgressSpinner /></div>
</template>
