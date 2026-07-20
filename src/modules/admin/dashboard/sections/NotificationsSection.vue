<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="notifications"
        title="Notifications"
        subtitle="Unread alerts and recent platform updates"
    >
        <template #default="{ items }">
            <div class="flex flex-col gap-3">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="dashboard-activity-item"
                    :class="{ 'dashboard-notification-unread': item.status === 'unread' }"
                >
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <strong class="text-sm">{{ item.title }}</strong>
                            <StatusBadge :value="item.status" />
                            <StatusBadge :value="item.type" />
                        </div>
                        <p class="m-0 mt-0.5 text-sm text-[var(--admin-text-muted)]">
                            {{ item.message }}
                        </p>
                        <small class="mt-1 block text-xs text-[var(--admin-text-muted)]">
                            {{ dashboard.formatDate(item.created_at) }}
                        </small>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button
                            v-if="item.status === 'unread'"
                            type="button"
                            class="dashboard-control"
                            @click="dashboard.markNotificationRead(item)"
                        >
                            Mark read
                        </button>
                        <button
                            type="button"
                            class="dashboard-control"
                            @click="dashboard.openDetail(item.title, item)"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </DashboardManagedSection>
</template>

<style scoped src="../dashboardShared.css"></style>
