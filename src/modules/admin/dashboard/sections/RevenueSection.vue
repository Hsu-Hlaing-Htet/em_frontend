<script setup>
import { inject } from 'vue';

const dashboard = inject('dashboard');
</script>

<template>
    <div class="flex flex-col gap-5">
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
                v-for="card in dashboard.revenueSummaryCards"
                :key="card.label"
                class="dashboard-stat-card dashboard-stat-card-static"
            >
                <p class="mb-1 text-xs uppercase tracking-widest text-[var(--admin-text-muted)]">
                    {{ card.label }}
                </p>
                <h3 class="m-0 text-2xl font-bold text-[var(--admin-text)]">
                    {{ card.value }}
                </h3>
            </article>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <article class="dashboard-panel">
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 class="m-0 text-base text-rosewood">
                            Revenue Overview
                        </h2>
                        <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                            Hover bars for monthly totals
                        </p>
                    </div>

                    <div class="dashboard-segment">
                        <button
                            v-for="months in [3, 6, 12]"
                            :key="months"
                            type="button"
                            class="dashboard-segment-button"
                            :class="{ 'dashboard-segment-button-active': dashboard.revenueRange === months }"
                            @click="dashboard.setRevenueRange(months)"
                        >
                            {{ months }}M
                        </button>
                    </div>
                </div>

                <div class="dashboard-chart">
                    <div
                        v-for="item in dashboard.visibleRevenueOverview"
                        :key="item.month"
                        class="flex flex-1 flex-col items-center gap-2"
                    >
                        <div
                            class="dashboard-chart-bar w-full"
                            :class="{ 'dashboard-chart-bar-active': dashboard.hoveredBar?.month === item.month }"
                            :style="{ height: dashboard.barHeight(item.amount) }"
                            @mouseenter="dashboard.hoverBar(item)"
                            @mouseleave="dashboard.clearHoveredBar"
                        />
                        <span class="text-xs text-[var(--admin-text-muted)]">{{ item.month }}</span>
                    </div>
                </div>

                <div
                    v-if="dashboard.hoveredBar"
                    class="dashboard-tooltip"
                >
                    <strong>{{ dashboard.hoveredBar.month }}</strong>
                    <span>{{ dashboard.formatCurrency(dashboard.hoveredBar.amount) }}</span>
                </div>
            </article>

            <article class="dashboard-panel">
                <h2 class="m-0 text-base text-rosewood">
                    Revenue Insights
                </h2>
                <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                    Key metrics for the selected period
                </p>

                <div class="mt-4 flex flex-col gap-3">
                    <div class="dashboard-insight-row">
                        <span>Average monthly collection</span>
                        <strong>{{ dashboard.formatCurrency(dashboard.revenueSummary.total_paid / 12) }}</strong>
                    </div>
                    <div class="dashboard-insight-row">
                        <span>Outstanding ratio</span>
                        <strong>{{ Math.round((dashboard.revenueSummary.outstanding / dashboard.revenueSummary.total_paid) * 100) }}%</strong>
                    </div>
                    <div class="dashboard-insight-row">
                        <span>Month-over-month growth</span>
                        <strong class="text-emerald-600">+{{ dashboard.revenueSummary.growth_percent }}%</strong>
                    </div>
                    <div class="dashboard-insight-row">
                        <span>Collected this month</span>
                        <strong>{{ dashboard.formatCurrency(dashboard.revenueSummary.collected_this_month) }}</strong>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>

<style scoped>
.dashboard-stat-card-static {
    cursor: default;
}

.dashboard-insight-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--admin-border);
    padding: 0.75rem 0.9rem;
    font-size: 0.875rem;
}
</style>
