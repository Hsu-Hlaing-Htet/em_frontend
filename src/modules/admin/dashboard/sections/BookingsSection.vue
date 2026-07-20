<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="bookings"
        title="Booking Management"
        subtitle="Viewings, reservations, and scheduled visits"
    >
        <template #default="{ items }">
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Client</th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Scheduled</th>
                            <th>Agent</th>
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
                            <td>{{ item.property }}</td>
                            <td>{{ item.type.replaceAll('_', ' ') }}</td>
                            <td>{{ dashboard.formatDate(item.scheduled_at) }}</td>
                            <td>{{ item.agent }}</td>
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
