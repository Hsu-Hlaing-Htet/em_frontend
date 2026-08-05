<script setup>
import { computed, inject, unref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardAreaChart from '../components/DashboardAreaChart.vue';
import DashboardEmptyState from '../components/DashboardEmptyState.vue';
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
const safeOccupancyByBuilding = computed(() => toSafeList(dashboard?.occupancyByBuilding).slice(0, 5));
const safeUpcomingContracts = computed(() => toSafeList(dashboard?.upcomingContracts));
const safeApprovalItems = computed(() => toSafeList(dashboard?.pendingApprovalBreakdown?.items));
const approvalTotal = computed(() => dashboard?.pendingApprovalBreakdown?.total ?? 0);
const collectionRate = computed(() => dashboard?.revenueCollections?.collection_rate ?? 0);

const maxApprovalCount = computed(() => {
    const counts = safeApprovalItems.value.map((item) => Number(item.count) || 0);
    return Math.max(...counts, 1);
});

function sparkColor(stat) {
    if (stat?.key === 'pending_approvals') {
        return '#c48d3d';
    }

    if (stat?.key === 'revenue') {
        return stat?.trend === 'up' ? '#d45a72' : '#b83a55';
    }

    if (stat?.key === 'occupancy' || stat?.key === 'outstanding') {
        return '#e8e8e8';
    }

    if (stat?.trend === 'up') {
        return '#d45a72';
    }

    if (stat?.trend === 'down') {
        return '#b83a55';
    }

    return '#9ca3af';
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

function navigateTo(path) {
    if (path) {
        router.push(path);
    }
}

function approvalBarWidth(count) {
    return `${((Number(count) || 0) / maxApprovalCount.value) * 100}%`;
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
                :class="{ 'dashboard-kpi-card--link': Boolean(stat.to) }"
                @click="handleStatClick(stat)"
            >
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

        <section class="dashboard-bottom-grid">
            <article class="dashboard-panel">
                <div class="dashboard-panel__header dashboard-panel__header--compact">
                    <h2 class="dashboard-panel__title">
                        Occupancy by Building
                    </h2>
                </div>

                <div class="dashboard-building-list">
                    <div
                        v-for="(building, buildingIndex) in safeOccupancyByBuilding"
                        :key="building.key ?? `building-${buildingIndex}`"
                        class="dashboard-building-row"
                    >
                        <span class="dashboard-building-label">{{ building.label }}</span>
                        <div class="dashboard-building-track">
                            <div
                                class="dashboard-building-fill"
                                :style="{ width: `${building.percent || 0}%` }"
                            />
                        </div>
                        <div class="dashboard-building-meta">
                            <span>{{ building.ratio_label }}</span>
                            <strong>{{ building.percent || 0 }}%</strong>
                        </div>
                    </div>
                </div>

                <DashboardEmptyState
                    v-if="safeOccupancyByBuilding.length === 0"
                    title="No buildings yet"
                    message="Occupancy will appear once buildings and rooms are configured."
                    icon="pi pi-building"
                />
            </article>

            <article class="dashboard-panel">
                <div class="dashboard-panel__header">
                    <div>
                        <h2 class="dashboard-panel__title">
                            Upcoming Contracts
                        </h2>
                        <p class="dashboard-panel__subtitle">
                            Active contracts ending within the next 60 days
                        </p>
                    </div>
                    <router-link
                        to="/admin/rent-contracts"
                        class="dashboard-panel__link"
                    >
                        View contracts
                        <i class="pi pi-angle-right" />
                    </router-link>
                </div>

                <div
                    v-if="safeUpcomingContracts.length"
                    class="dashboard-contract-list"
                >
                    <div
                        v-for="(contract, contractIndex) in safeUpcomingContracts"
                        :key="contract.id ?? `contract-${contractIndex}`"
                        class="dashboard-contract-row"
                        @click="navigateTo(contract.to)"
                    >
                        <span class="dashboard-contract-marker" />
                        <div class="dashboard-contract-copy">
                            <strong>{{ contract.number }}</strong>
                            <span>{{ contract.property }}</span>
                        </div>
                        <span class="dashboard-contract-date">{{ contract.end_date }}</span>
                        <span class="dashboard-contract-days">{{ contract.days_left }} days</span>
                    </div>
                </div>

                <DashboardEmptyState
                    v-else
                    title="No upcoming expirations"
                    message="No active contracts are scheduled to end in the next 60 days."
                    icon="pi pi-calendar"
                />
            </article>

            <article class="dashboard-panel">
                <div class="dashboard-panel__header">
                    <div>
                        <h2 class="dashboard-panel__title">
                            Pending Approvals
                        </h2>
                        <p class="dashboard-panel__subtitle">
                            Items waiting in approval queues
                        </p>
                    </div>
                    <div class="dashboard-panel__metric dashboard-panel__metric--compact">
                        <strong class="dashboard-panel__metric-value">{{ approvalTotal }}</strong>
                    </div>
                </div>

                <div class="dashboard-approval-list">
                    <button
                        v-for="(item, itemIndex) in safeApprovalItems"
                        :key="item.key ?? `approval-${itemIndex}`"
                        type="button"
                        class="dashboard-approval-row"
                        @click="navigateTo(item.to)"
                    >
                        <span class="dashboard-approval-icon">
                            <i :class="item.icon" />
                        </span>
                        <div class="dashboard-approval-copy">
                            <span>{{ item.label }}</span>
                            <div class="dashboard-approval-track">
                                <div
                                    class="dashboard-approval-fill"
                                    :style="{ width: approvalBarWidth(item.count) }"
                                />
                            </div>
                        </div>
                        <strong class="dashboard-approval-count">{{ item.count }}</strong>
                    </button>
                </div>

                <router-link
                    to="/admin/approvals/sale-contracts"
                    class="dashboard-panel__link dashboard-panel__link--footer"
                >
                    Review all
                    <i class="pi pi-angle-right" />
                </router-link>
            </article>
        </section>
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>
