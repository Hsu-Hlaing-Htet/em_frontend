<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="payments"
        title="Payment Tracking"
        subtitle="Approved, pending, and rejected payment records"
        admin-route="/admin/payments"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Client</th>
                            <th>Invoice</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                        >
                            <td>{{ item.reference }}</td>
                            <td>{{ item.client }}</td>
                            <td>{{ item.invoice }}</td>
                            <td>{{ dashboard.formatCurrency(item.amount) }}</td>
                            <td>{{ item.method }}</td>
                            <td><StatusBadge :value="item.status" /></td>
                            <td>
                                <button
                                    type="button"
                                    class="dashboard-control"
                                    @click="dashboard.openDetail(item.reference, item)"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DashboardManagedSection>
</template>

<style scoped src="../dashboardShared.css"></style>
