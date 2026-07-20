<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="maintenance"
        title="Maintenance Requests"
        subtitle="Work orders and facility service queue"
        admin-route="/admin/maintenance-requests"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Tenant</th>
                            <th>Unit</th>
                            <th>Category</th>
                            <th>Priority</th>
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
                            <td>{{ item.tenant }}</td>
                            <td>{{ item.unit }}</td>
                            <td>{{ item.category }}</td>
                            <td><StatusBadge :value="item.priority" /></td>
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
