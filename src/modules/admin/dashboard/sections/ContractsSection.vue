<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="contracts"
        title="Contract Management"
        subtitle="Sale and rent contract pipeline"
        admin-route="/admin/sale-contracts/active"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Client</th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Status</th>
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
                            <td>{{ item.property }}</td>
                            <td>{{ item.type }}</td>
                            <td>{{ dashboard.formatCurrency(item.value) }}</td>
                            <td><StatusBadge :value="item.status" /></td>
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
