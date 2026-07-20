<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="invoices"
        title="Invoice Management"
        subtitle="Issued, partial, and overdue billing"
        admin-route="/admin/invoices"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Client</th>
                            <th>Contract</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Due</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                        >
                            <td>{{ item.number }}</td>
                            <td>{{ item.client }}</td>
                            <td>{{ item.contract }}</td>
                            <td>{{ dashboard.formatCurrency(item.amount) }}</td>
                            <td><StatusBadge :value="item.status" /></td>
                            <td>{{ dashboard.formatDate(item.due_date) }}</td>
                            <td>
                                <button
                                    type="button"
                                    class="dashboard-control"
                                    @click="dashboard.openDetail(item.number, item)"
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
