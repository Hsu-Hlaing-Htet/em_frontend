<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="activity"
        title="Activity Timeline"
        subtitle="Chronological platform events"
    >
        <template #default="{ items }">
            <div class="flex flex-col gap-3">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="dashboard-activity-item"
                >
                    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rosewood/10 text-rosewood">
                        <i :class="item.icon" />
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <strong class="text-sm">{{ item.title }}</strong>
                            <StatusBadge :value="item.status" />
                        </div>
                        <p class="m-0 mt-0.5 text-sm text-[var(--admin-text-muted)]">
                            {{ item.detail }}
                        </p>
                        <small class="mt-1 block text-xs text-[var(--admin-text-muted)]">
                            {{ item.time }}
                        </small>
                    </div>
                    <button
                        type="button"
                        class="dashboard-control"
                        @click="dashboard.openDetail(item.title, item)"
                    >
                        View
                    </button>
                </div>
            </div>
        </template>
    </DashboardManagedSection>
</template>

<style scoped src="../dashboardShared.css"></style>
