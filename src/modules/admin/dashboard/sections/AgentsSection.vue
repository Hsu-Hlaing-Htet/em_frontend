<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="agents"
        title="Agent Management"
        subtitle="Sales and leasing agent performance"
        admin-route="/admin/staff"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Listings</th>
                            <th>Deals Closed</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                        >
                            <td>{{ item.name }}</td>
                            <td>{{ item.department }}</td>
                            <td>{{ item.listings }}</td>
                            <td>{{ item.deals_closed }}</td>
                            <td><StatusBadge :value="item.status" /></td>
                            <td>
                                <button
                                    type="button"
                                    class="dashboard-control"
                                    @click="dashboard.openDetail(item.name, item)"
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
