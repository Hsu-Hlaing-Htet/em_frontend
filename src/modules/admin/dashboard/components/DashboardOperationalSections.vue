<script setup>
import { computed, inject, unref } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardEmptyState from './DashboardEmptyState.vue';

const dashboard = inject('dashboard', null);

function safeList(source) {
    const value = unref(source);
    return Array.isArray(value) ? value.filter(Boolean) : [];
}

const pendingApprovalItems = computed(() => safeList(dashboard?.pendingApprovals?.latest).slice(0, 5));
const expiringContracts = computed(() => (
    safeList(dashboard?.upcomingContracts)
        .filter((contract) => Number(contract?.days_left) <= 60)
        .slice(0, 5)
));
const systemAlertItems = computed(() => safeList(dashboard?.systemAlerts?.items).slice(0, 5));

function contractDetail(contract) {
    return [contract?.customer, contract?.property]
        .map((part) => String(part || '').trim())
        .filter(Boolean)
        .join(' · ');
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
                    <h2 class="dashboard-panel__title">Pending Approvals</h2>
                    <p class="dashboard-panel__subtitle">Newest items waiting for review</p>
                </div>
            </div>

            <div v-if="pendingApprovalItems.length" class="dashboard-ops-list">
                <router-link
                    v-for="item in pendingApprovalItems"
                    :key="item.id"
                    :to="item.to"
                    class="dashboard-ops-row"
                >
                    <div class="dashboard-ops-main">
                        <span class="dashboard-ops-reference">{{ item.reference }}</span>
                        <span class="dashboard-ops-detail">{{ item.detail }}</span>
                    </div>

                    <div class="dashboard-ops-aside">
                        <span class="dashboard-ops-meta">{{ item.type_label }}</span>
                        <time class="dashboard-ops-datetime rw-numeric rw-date">
                            {{ item.created_at }}
                        </time>
                    </div>

                    <i
                        class="pi pi-chevron-right dashboard-ops-chevron"
                        aria-hidden="true"
                    />
                </router-link>
            </div>

            <DashboardEmptyState
                v-else
                title="No pending approvals"
                message="You're all caught up."
                icon="pi pi-check-circle"
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

            <div v-if="expiringContracts.length" class="dashboard-ops-list">
                <router-link
                    v-for="contract in expiringContracts"
                    :key="contract.id"
                    :to="contract.to"
                    class="dashboard-ops-row"
                >
                    <div class="dashboard-ops-main">
                        <span class="dashboard-ops-reference">{{ contract.number }}</span>
                        <span class="dashboard-ops-detail">{{ contractDetail(contract) }}</span>
                    </div>

                    <div class="dashboard-ops-aside">
                        <time class="dashboard-ops-datetime rw-numeric rw-date">
                            {{ contract.end_date }}
                        </time>
                        <span
                            class="dashboard-ops-days rw-numeric"
                            :class="`dashboard-ops-days--${contractUrgency(contract.days_left)}`"
                        >
                            {{ contract.days_left }} days
                        </span>
                    </div>

                    <i
                        class="pi pi-chevron-right dashboard-ops-chevron"
                        aria-hidden="true"
                    />
                </router-link>
            </div>

            <DashboardEmptyState
                v-else
                title="No contracts expiring soon."
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

            <div v-if="systemAlertItems.length" class="dashboard-ops-list">
                <router-link
                    v-for="alert in systemAlertItems"
                    :key="alert.id"
                    :to="alert.to"
                    class="dashboard-ops-row"
                    :class="{ 'dashboard-ops-row--stacked': alert.kind !== 'overdue_invoice' }"
                >
                    <div class="dashboard-ops-main">
                        <span class="dashboard-ops-reference">
                            {{ alert.title || alert.number }}
                        </span>
                        <span class="dashboard-ops-detail">{{ alert.detail }}</span>
                        <span
                            v-if="alert.kind !== 'overdue_invoice'"
                            class="dashboard-ops-status-text"
                        >
                            {{ alert.status_label }}
                        </span>
                    </div>

                    <div
                        class="dashboard-ops-aside"
                        :class="{ 'dashboard-ops-aside--stretch': alert.kind !== 'overdue_invoice' }"
                    >                        <time
                            v-if="alert.kind === 'overdue_invoice'"
                            class="dashboard-ops-datetime rw-numeric rw-date"
                        >
                            {{ alert.due_date }}
                        </time>
                        <time
                            v-else
                            class="dashboard-ops-datetime rw-numeric rw-date"
                        >
                            {{ alert.created_at }}
                        </time>

                        <span class="dashboard-ops-status-row">
                            <StatusBadge
                                v-if="alert.kind === 'overdue_invoice'"
                                value="overdue"
                            />
                            <StatusBadge
                                v-else
                                value="high"
                            />
                        </span>
                    </div>

                    <i
                        class="pi pi-chevron-right dashboard-ops-chevron"
                        aria-hidden="true"
                    />
                </router-link>
            </div>

            <DashboardEmptyState
                v-else
                title="No system alerts."
                message="Operational conditions are currently clear."
                icon="pi pi-check-circle"
            />
        </article>
    </section>
</template>
