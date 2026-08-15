<script setup>
import { computed, inject, unref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardAreaChart from '../components/DashboardAreaChart.vue';
import DashboardOperationalSections from '../components/DashboardOperationalSections.vue';
import DashboardSparkline from '../components/DashboardSparkline.vue';

const dashboard = inject('dashboard', null);
const router = useRouter();

function toSafeList(source) {
    const value = unref(source);

    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item) => item != null && typeof item === 'object');
}

const safeStats = computed(() => toSafeList(dashboard?.stats));
const safeRevenueCollections = computed(() => dashboard?.revenueCollections?.points ?? []);
const safeReceivableAging = computed(() => toSafeList(dashboard?.receivableAging));
const collectionRate = computed(() => dashboard?.revenueCollections?.collection_rate ?? 0);

const statIcons = {
    revenue: 'pi pi-chart-line',
    occupancy: 'pi pi-users',
    outstanding: 'pi pi-wallet',
    pending_approvals: 'pi pi-clock',
};

function sparkColor(stat) {
    if (stat?.key === 'pending_approvals') {
        return '#e56b12';
    }

    if (stat?.key === 'revenue') {
        return '#ef3340';
    }

    if (stat?.key === 'occupancy') {
        return '#2f7df4';
    }

    if (stat?.key === 'outstanding') {
        return '#20a85a';
    }

    return '#667085';
}

function changeClass(stat) {
    if (stat?.key === 'pending_approvals') {
        return 'dashboard-kpi-change-warning';
    }

    if (stat?.trend === 'up') {
        return 'dashboard-kpi-change-up';
    }

    if (stat?.trend === 'down') {
        return 'dashboard-kpi-change-down';
    }

    return 'dashboard-kpi-change-neutral';
}

function handleStatClick(stat) {
    if (stat?.to) {
        router.push(stat.to);
    }
}

function statIcon(stat) {
    return statIcons[stat?.key] ?? 'pi pi-chart-bar';
}
</script>

<template>
    <div
        v-if="dashboard"
        class="dashboard-overview"
    >
        <section class="dashboard-kpi-grid">
            <article
                v-for="(stat, statIndex) in safeStats"
                :key="stat.key ?? `overview-stat-${statIndex}`"
                class="dashboard-stat-card dashboard-kpi-card"
                :class="[
                    `dashboard-kpi-card--${stat.key}`,
                    { 'dashboard-kpi-card--link': Boolean(stat.to) },
                ]"
                @click="handleStatClick(stat)"
            >
                <div class="dashboard-kpi-header">
                    <span class="dashboard-kpi-icon" aria-hidden="true">
                        <i :class="statIcon(stat)" />
                    </span>
                    <div class="dashboard-kpi-copy">
                        <p class="dashboard-kpi-label">
                            {{ stat.label }}
                        </p>
                        <h3 class="dashboard-kpi-value">
                            {{ stat.value }}
                        </h3>
                        <p
                            class="dashboard-kpi-change"
                            :class="changeClass(stat)"
                        >
                            {{ stat.change }}
                        </p>
                    </div>
                </div>
                <div class="dashboard-kpi-spark">
                    <DashboardSparkline
                        :values="stat.sparkline || []"
                        :color="sparkColor(stat)"
                        :height="48"
                    />
                </div>
            </article>
        </section>

        <section class="dashboard-main-grid">
            <article class="dashboard-panel dashboard-panel--chart">
                <div class="dashboard-panel__header">
                    <div>
                        <h2 class="dashboard-panel__title">
                            Revenue &amp; Collections
                        </h2>
                        <p class="dashboard-panel__subtitle">
                            Billed vs collected over the last six months
                        </p>
                    </div>
                    <div class="dashboard-panel__metric">
                        <span class="dashboard-panel__metric-label">Collection rate</span>
                        <strong class="dashboard-panel__metric-value">{{ collectionRate }}%</strong>
                    </div>
                </div>

                <div class="dashboard-panel__legend">
                    <span class="dashboard-legend-item">
                        <i class="dashboard-legend-swatch dashboard-legend-swatch--billed" />
                        Billed
                    </span>
                    <span class="dashboard-legend-item">
                        <i class="dashboard-legend-swatch dashboard-legend-swatch--collected" />
                        Collected
                    </span>
                </div>

                <DashboardAreaChart :points="safeRevenueCollections" />
            </article>

            <article class="dashboard-panel">
                <div class="dashboard-panel__header">
                    <div>
                        <h2 class="dashboard-panel__title">
                            Receivable Aging
                        </h2>
                        <p class="dashboard-panel__subtitle">
                            Outstanding balances by days past due
                        </p>
                    </div>
                </div>

                <div class="dashboard-aging-list">
                    <div
                        v-for="(bucket, bucketIndex) in safeReceivableAging"
                        :key="bucket.key ?? `aging-${bucketIndex}`"
                        class="dashboard-aging-row"
                        :class="{ 'dashboard-aging-row--highlight': bucket.highlight }"
                    >
                        <span class="dashboard-aging-label">{{ bucket.label }}</span>
                        <div class="dashboard-aging-track">
                            <div
                                class="dashboard-aging-fill"
                                :style="{ width: `${bucket.percent || 0}%` }"
                            />
                        </div>
                        <div class="dashboard-aging-meta">
                            <strong>{{ bucket.amount_label }}</strong>
                            <span>{{ bucket.percent || 0 }}%</span>
                        </div>
                    </div>
                </div>
            </article>
        </section>

        <DashboardOperationalSections />
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>
