<script setup>
import { computed, inject, unref } from 'vue';
import DashboardEmptyState from './DashboardEmptyState.vue';

const dashboard = inject('dashboard', null);

function safeList(source) {
    const value = unref(source);
    return Array.isArray(value) ? value.filter(Boolean) : [];
}

const activityItems = computed(() => safeList(dashboard?.recentActivity).slice(0, 4));
const expiringContracts = computed(() => (
    safeList(dashboard?.upcomingContracts)
        .filter((contract) => Number(contract?.days_left) <= 60)
        .slice(0, 5)
));

const overdueInvoiceCount = computed(() => {
    const metric = safeList(dashboard?.invoiceStats).find((item) => item?.key === 'overdue');
    return Number(metric?.value) || 0;
});

const expiredContractCount = computed(() => (
    Number(dashboard?.systemAlerts?.expired_contracts) || 0
));

const unresolvedMaintenanceCount = computed(() => (
    Number(dashboard?.systemAlerts?.unresolved_maintenance) || 0
));

const alerts = computed(() => [
    {
        key: 'overdue-payments',
        label: 'Overdue payments',
        detail: 'Invoices requiring payment follow-up',
        count: overdueInvoiceCount.value,
        severity: overdueInvoiceCount.value ? 'high' : 'clear',
        status: overdueInvoiceCount.value ? 'Action needed' : 'Clear',
        to: '/admin/invoices',
    },
    {
        key: 'expired-contracts',
        label: 'Expired contracts',
        detail: 'Active contracts past their end date',
        count: expiredContractCount.value,
        severity: expiredContractCount.value ? 'high' : 'clear',
        status: expiredContractCount.value ? 'Review' : 'Clear',
        to: '/admin/rent-contracts/active',
    },
    {
        key: 'unresolved-maintenance',
        label: 'Unresolved maintenance',
        detail: 'Open maintenance requests',
        count: unresolvedMaintenanceCount.value,
        severity: unresolvedMaintenanceCount.value ? 'medium' : 'clear',
        status: unresolvedMaintenanceCount.value ? 'Open' : 'Clear',
        to: '/admin/maintenance-requests',
    },
]);

function contractWindow(daysLeft) {
    const days = Number(daysLeft) || 0;

    if (days <= 7) {
        return '7 days';
    }

    if (days <= 30) {
        return '30 days';
    }

    return '60 days';
}

function contractUrgency(daysLeft) {
    const days = Number(daysLeft) || 0;

    if (days <= 7) {
        return 'urgent';
    }

    if (days <= 30) {
        return 'soon';
    }

    return 'standard';
}
</script>

<template>
    <section class="dashboard-operations-grid">
        <article class="dashboard-panel dashboard-operations-card">
            <div class="dashboard-panel__header">
                <div>
                    <h2 class="dashboard-panel__title">Recent Activity</h2>
                    <p class="dashboard-panel__subtitle">Latest admin actions and approvals</p>
                </div>
            </div>

            <div v-if="activityItems.length" class="dashboard-activity-compact-list">
                <div
                    v-for="item in activityItems"
                    :key="item.id"
                    class="dashboard-activity-compact-row"
                >
                    <span class="dashboard-activity-dot" aria-hidden="true" />
                    <div class="dashboard-activity-compact-copy">
                        <strong>{{ item.title }}</strong>
                        <span>{{ item.detail }}</span>
                    </div>
                    <time>{{ item.time }}</time>
                </div>
            </div>

            <DashboardEmptyState
                v-else
                title="No recent activity"
                message="Recent admin actions will appear here."
                icon="pi pi-history"
            />
        </article>

        <article class="dashboard-panel dashboard-operations-card">
            <div class="dashboard-panel__header">
                <div>
                    <h2 class="dashboard-panel__title">Expiring Contracts</h2>
                    <p class="dashboard-panel__subtitle">Contracts ending within 7, 30, or 60 days</p>
                </div>
                <router-link to="/admin/rent-contracts/active" class="dashboard-panel__link">
                    View all
                    <i class="pi pi-angle-right" />
                </router-link>
            </div>

            <div v-if="expiringContracts.length" class="dashboard-expiring-list">
                <router-link
                    v-for="contract in expiringContracts"
                    :key="contract.id"
                    :to="contract.to"
                    class="dashboard-expiring-row"
                    :class="`dashboard-expiring-row--${contractUrgency(contract.days_left)}`"
                >
                    <div class="dashboard-expiring-copy">
                        <strong>{{ contract.number }}</strong>
                        <span>{{ contract.customer || contract.client || contract.property }}</span>
                    </div>
                    <div class="dashboard-expiring-date">
                        <span>{{ contract.end_date }}</span>
                        <small>{{ contractWindow(contract.days_left) }} window</small>
                    </div>
                    <span
                        class="dashboard-days-badge"
                        :class="`dashboard-days-badge--${contractUrgency(contract.days_left)}`"
                    >
                        {{ contract.days_left }} days
                    </span>
                </router-link>
            </div>

            <DashboardEmptyState
                v-else
                title="No upcoming expirations"
                message="No active contracts end in the next 60 days."
                icon="pi pi-calendar"
            />
        </article>

        <article class="dashboard-panel dashboard-operations-card">
            <div class="dashboard-panel__header">
                <div>
                    <h2 class="dashboard-panel__title">System Alerts</h2>
                    <p class="dashboard-panel__subtitle">Items requiring operational attention</p>
                </div>
            </div>

            <div class="dashboard-alert-list">
                <router-link
                    v-for="alert in alerts"
                    :key="alert.key"
                    :to="alert.to"
                    class="dashboard-alert-row"
                >
                    <span
                        class="dashboard-alert-indicator"
                        :class="`dashboard-alert-indicator--${alert.severity}`"
                        aria-hidden="true"
                    />
                    <div class="dashboard-alert-copy">
                        <strong>{{ alert.label }}</strong>
                        <span>{{ alert.detail }}</span>
                    </div>
                    <span class="dashboard-alert-count">{{ alert.count }}</span>
                    <span
                        class="dashboard-alert-status"
                        :class="`dashboard-alert-status--${alert.severity}`"
                    >
                        {{ alert.status }}
                    </span>
                </router-link>
            </div>
        </article>
    </section>
</template>
