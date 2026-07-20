<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <div class="flex flex-col gap-5">
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
                v-for="item in dashboard.reportStats"
                :key="item.key"
                class="dashboard-stat-card dashboard-stat-card-static"
            >
                <p class="mb-1 text-xs uppercase tracking-widest text-[var(--admin-text-muted)]">
                    {{ item.label }}
                </p>
                <h3 class="m-0 text-3xl font-bold text-[var(--admin-text)]">
                    {{ item.value }}
                </h3>
            </article>
        </section>

        <DashboardManagedSection
            section-key="reports"
            title="Reports & Analytics"
            subtitle="Exportable operational and financial reports"
        >
            <template #default="{ items }">
                <div class="dashboard-table-wrap">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Format</th>
                                <th>Period</th>
                                <th>Status</th>
                                <th>Generated</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in items"
                                :key="item.id"
                            >
                                <td>{{ item.name }}</td>
                                <td>{{ item.category }}</td>
                                <td>{{ item.format }}</td>
                                <td>{{ item.period }}</td>
                                <td><StatusBadge :value="item.status" /></td>
                                <td>{{ dashboard.formatDate(item.generated_at) }}</td>
                                <td>
                                    <div class="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            class="dashboard-control"
                                            @click="dashboard.openDetail(item.name, item)"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            class="dashboard-control dashboard-control-primary"
                                            :disabled="item.status === 'generating'"
                                            @click="dashboard.generateReport(item)"
                                        >
                                            {{ item.status === 'ready' ? 'Regenerate' : 'Generate' }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </DashboardManagedSection>
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>

<style scoped>
.dashboard-stat-card-static {
    cursor: default;
}
</style>
