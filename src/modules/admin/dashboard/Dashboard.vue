<script setup>
import { computed } from 'vue';
import { useDashboard } from './useDashboard';

const {
    stats,
    propertyStats,
    revenueOverview,
    userOverview,
    recentActivity,
    quickActions,
} = useDashboard();

const maxRevenue = computed(() =>
    Math.max(...revenueOverview.value.map((item) => item.amount), 1)
);

const maxProperty = computed(() =>
    Math.max(...propertyStats.value.map((item) => item.value), 1)
);
</script>

<template>
    <div class="flex flex-col gap-5">
        <section class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="title m-0 mb-1.5">Executive Overview</p>
                <h1 class="m-0 font-serif text-3xl text-rosewood md:text-4xl">Dashboard</h1>
                <p class="mt-1.5 text-[var(--admin-text-muted)]">
                    Luxury property performance, revenue insights, and platform activity at a glance.
                </p>
            </div>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
                v-for="stat in stats"
                :key="stat.label"
                class="dashboard-stat-card"
            >
                <div class="flex items-center justify-between gap-3">
                    <div class="dashboard-stat-icon">
                        <i :class="stat.icon" />
                    </div>
                    <span class="text-sm font-medium text-emerald-600">{{ stat.change }}</span>
                </div>
                <p class="mb-1 mt-4 text-xs uppercase tracking-widest text-[var(--admin-text-muted)]">{{ stat.label }}</p>
                <h3 class="m-0 text-3xl font-bold text-[var(--admin-text)]">{{ stat.value }}</h3>
            </article>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="m-0 text-base text-rosewood">Revenue Overview</h2>
                    <span class="text-sm text-[var(--admin-text-muted)]">Last 6 months</span>
                </div>
                <div class="dashboard-chart">
                    <div
                        v-for="item in revenueOverview"
                        :key="item.month"
                        class="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                        <div
                            class="dashboard-chart-bar"
                            :style="{ height: `${(item.amount / maxRevenue) * 100}%` }"
                        />
                        <span class="text-xs text-[var(--admin-text-muted)]">{{ item.month }}</span>
                    </div>
                </div>
            </article>

            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="m-0 text-base text-rosewood">Property Statistics</h2>
                </div>
                <div class="flex flex-col gap-3.5">
                    <div
                        v-for="item in propertyStats"
                        :key="item.label"
                        class="grid grid-cols-[90px_1fr_42px] items-center gap-3"
                    >
                        <span class="text-sm">{{ item.label }}</span>
                        <div class="h-2.5 overflow-hidden rounded-full bg-rosewood-secondary/25">
                            <div
                                class="h-full rounded-full transition-all duration-300"
                                :style="{
                                    width: `${(item.value / maxProperty) * 100}%`,
                                    background: item.color,
                                }"
                            />
                        </div>
                        <strong class="text-sm">{{ item.value }}</strong>
                    </div>
                </div>
            </article>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="m-0 text-base text-rosewood">User Overview</h2>
                </div>
                <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div
                        v-for="entry in [
                            { label: 'Owners', value: userOverview.owners },
                            { label: 'Tenants', value: userOverview.tenants },
                            { label: 'Admins', value: userOverview.admins },
                            { label: 'Customers', value: userOverview.customers },
                        ]"
                        :key="entry.label"
                        class="rounded-xl border border-[var(--admin-border)] bg-gradient-to-br from-rosewood/5 to-rosewood-secondary/15 p-4"
                    >
                        <span class="text-xs uppercase tracking-wider text-[var(--admin-text-muted)]">{{ entry.label }}</span>
                        <strong class="mt-1 block text-2xl text-rosewood">{{ entry.value }}</strong>
                    </div>
                </div>
            </article>

            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="m-0 text-base text-rosewood">Recent Activity</h2>
                </div>
                <div class="flex flex-col gap-3">
                    <div
                        v-for="item in recentActivity"
                        :key="item.id"
                        class="dashboard-activity-item"
                    >
                        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rosewood/10 text-rosewood">
                            <i :class="item.icon" />
                        </div>
                        <div>
                            <strong class="block text-sm">{{ item.title }}</strong>
                            <p class="m-0 mt-0.5 text-sm text-[var(--admin-text-muted)]">{{ item.detail }}</p>
                            <small class="mt-1 block text-xs text-[var(--admin-text-muted)]">{{ item.time }}</small>
                        </div>
                    </div>
                </div>
            </article>
        </section>

        <section class="dashboard-panel">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="m-0 text-base text-rosewood">Quick Actions</h2>
            </div>
            <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                <router-link
                    v-for="action in quickActions"
                    :key="action.label"
                    :to="action.to"
                    class="dashboard-quick-action"
                >
                    <i
                        :class="action.icon"
                        class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rosewood to-rosewood-accent text-white"
                    />
                    <span>{{ action.label }}</span>
                </router-link>
            </div>
        </section>
    </div>
</template>

<style scoped>
.dashboard-panel {
    border-radius: 1rem;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface);
    padding: 1.25rem;
    box-shadow: var(--admin-shadow-soft);
    backdrop-filter: blur(12px);
}

.dashboard-stat-card {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface);
    padding: 1.25rem;
    box-shadow: var(--admin-shadow-soft);
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
}

.dashboard-stat-card:hover {
    transform: translateY(-0.25rem);
    box-shadow: var(--admin-shadow);
}

.dashboard-stat-card::after {
    content: '';
    position: absolute;
    top: -1.5rem;
    right: -1.5rem;
    width: 7rem;
    height: 7rem;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(214, 184, 193, 0.28), transparent 70%);
    pointer-events: none;
}

.dashboard-stat-icon {
    display: grid;
    height: 2.75rem;
    width: 2.75rem;
    place-items: center;
    border-radius: 0.75rem;
    background: linear-gradient(to bottom right, rgba(85, 32, 50, 0.15), rgba(214, 184, 193, 0.3));
    color: var(--admin-primary);
}

.dashboard-chart {
    display: flex;
    height: 14rem;
    align-items: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
}

.dashboard-chart-bar {
    width: 100%;
    border-radius: 0.75rem 0.75rem 0 0;
    background: linear-gradient(to top, var(--admin-primary), var(--admin-accent));
    transition: all 0.3s ease;
}

.dashboard-activity-item {
    display: flex;
    gap: 0.875rem;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    padding: 0.875rem;
    transition: all 0.3s ease;
}

.dashboard-activity-item:hover {
    border-color: var(--admin-border);
    background: rgba(214, 184, 193, 0.1);
}

.dashboard-quick-action {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    border-radius: 1rem;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface-solid);
    padding: 1rem;
    color: var(--admin-text);
    text-decoration: none;
    transition: all 0.3s ease;
}

.dashboard-quick-action:hover {
    transform: translateY(-0.25rem);
    border-color: rgba(122, 49, 73, 0.25);
    box-shadow: var(--admin-shadow-soft);
}
</style>
