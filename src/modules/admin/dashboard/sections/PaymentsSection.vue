<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import PaymentListTable from '@/components/admin/payments/PaymentListTable.vue';
import { mapDashboardPaymentRow } from '@/helpers/payments/paymentListHelpers';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
const router = useRouter();

function handleView(item) {
    dashboard.openDetail(item.invoice_number || item.reference, mapDashboardPaymentRow(item));
}

function handleReceipt(item) {
    if (item.receipt_id) {
        router.push({ name: 'showReceipt', params: { id: item.receipt_id } });
    }
}
</script>

<template>
    <DashboardManagedSection
        section-key="payments"
        title="Payment Tracking"
        subtitle="Rent, utility, and maintenance payments with invoice balances"
        admin-route="/admin/payments"
    >
        <template #default="{ items }">
            <PaymentListTable
                variant="dashboard"
                :items="items.map(mapDashboardPaymentRow)"
                :format-date="dashboard.formatDate"
                @view="handleView"
                @receipt="handleReceipt"
            />
        </template>
    </DashboardManagedSection>
</template>

<style scoped src="../dashboardShared.css"></style>
