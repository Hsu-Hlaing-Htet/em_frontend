<script setup>
import { computed, inject, unref } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardEmptyState from '../components/DashboardEmptyState.vue';
import PropertySpotlightPanel from '../components/PropertySpotlightPanel.vue';

const dashboard = inject('dashboard', null);

function toSafeList(source) {
    const value = unref(source);

    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item) => item != null && typeof item === 'object');
}

const safeRecentlyViewedProperties = computed(() => toSafeList(dashboard?.recentlyViewedProperties));
const safeFavoriteProperties = computed(() => toSafeList(dashboard?.favoriteProperties));
const safeStats = computed(() => toSafeList(dashboard?.stats));
const safePropertyStats = computed(() => toSafeList(dashboard?.filteredPropertyStats));
const safeInvoiceStats = computed(() => toSafeList(dashboard?.filteredInvoiceStats));
const safeActivity = computed(() => toSafeList(dashboard?.filteredActivity));
const safeQuickActions = computed(() => toSafeList(dashboard?.filteredQuickActions));
</script>

<template>
    <div
        v-if="dashboard"
        class="flex flex-col gap-5"
    >
        <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PropertySpotlightPanel
                title="Recently Viewed"
                :properties="safeRecentlyViewedProperties"
                :loading="dashboard.loading"
                :format-currency="dashboard.formatCurrency"
                :is-favorite="dashboard.isFavorite"
                :is-in-compare="dashboard.isInCompare"
                :can-add-to-compare="dashboard.canAddToCompare"
                @view="dashboard.viewProperty"
                @favorite="dashboard.handleFavorite"
                @compare="dashboard.handleCompare"
            />

            <PropertySpotlightPanel
                title="Favorite Properties"
                :properties="safeFavoriteProperties"
                :loading="dashboard.loading"
                :format-currency="dashboard.formatCurrency"
                :is-favorite="dashboard.isFavorite"
                :is-in-compare="dashboard.isInCompare"
                :can-add-to-compare="dashboard.canAddToCompare"
                @view="dashboard.viewProperty"
                @favorite="dashboard.handleFavorite"
                @compare="dashboard.handleCompare"
            />
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
                v-for="(stat, statIndex) in safeStats"
                :key="stat.key ?? `overview-stat-${statIndex}`"
                class="dashboard-stat-card"
                :class="{ 'dashboard-stat-card-selected': dashboard.selectedStat?.key === stat.key }"
                @click="dashboard.selectStat(stat)"
            >
                <div class="flex items-center justify-between gap-3">
                    <div class="dashboard-stat-icon">
                        <i :class="stat.icon" />
                    </div>
                    <span class="text-sm font-medium text-emerald-600">{{ stat.change }}</span>
                </div>
                <p class="mb-1 mt-4 text-xs uppercase tracking-widest text-[var(--admin-text-muted)]">
                    {{ stat.label }}
                </p>
                <h3 class="m-0 text-3xl font-bold text-[var(--admin-text)]">
                    {{ stat.value }}
                </h3>
            </article>
        </section>

        <section
            v-if="dashboard.selectedStat"
            class="dashboard-panel dashboard-selected-detail"
        >
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="m-0 text-xs uppercase tracking-widest text-[var(--admin-text-muted)]">
                        Selected metric
                    </p>
                    <h2 class="m-0 mt-1 text-lg text-rosewood">
                        {{ dashboard.selectedStat.label }}
                    </h2>
                    <p class="m-0 mt-2 text-sm text-[var(--admin-text-muted)]">
                        {{ dashboard.selectedStat.detail }}
                    </p>
                </div>
                <button
                    type="button"
                    class="dashboard-control"
                    @click="dashboard.clearSelectedStat"
                >
                    Clear
                </button>
            </div>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 class="m-0 text-base text-rosewood">
                            Property Statistics
                        </h2>
                        <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                            Click a row to filter
                        </p>
                    </div>
                    <button
                        v-if="dashboard.propertyFilter"
                        type="button"
                        class="dashboard-control"
                        @click="dashboard.clearPropertyFilter"
                    >
                        Clear filter
                    </button>
                </div>

                <div class="flex flex-col gap-3.5">
                    <button
                        v-for="(item, itemIndex) in safePropertyStats"
                        :key="item.key ?? `property-stat-${itemIndex}`"
                        type="button"
                        class="dashboard-progress-row"
                        :class="{ 'dashboard-progress-row-active': dashboard.propertyFilter === item.key }"
                        @click="dashboard.togglePropertyFilter(item.key)"
                    >
                        <span class="text-sm">{{ item.label }}</span>
                        <div class="h-2.5 overflow-hidden rounded-full bg-rosewood-secondary/25">
                            <div
                                class="h-full rounded-full transition-all duration-300"
                                :style="{ width: dashboard.propertyBarWidth(item.value), background: item.color }"
                            />
                        </div>
                        <strong class="text-sm">{{ item.value }}</strong>
                    </button>
                </div>
            </article>

            <article class="dashboard-panel">
                <div class="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 class="m-0 text-base text-rosewood">
                            Invoice Status
                        </h2>
                        <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                            Click a status to focus billing activity
                        </p>
                    </div>
                    <button
                        v-if="dashboard.invoiceFilter"
                        type="button"
                        class="dashboard-control"
                        @click="dashboard.clearInvoiceFilter"
                    >
                        Clear filter
                    </button>
                </div>

                <div class="flex flex-col gap-3.5">
                    <button
                        v-for="(item, itemIndex) in safeInvoiceStats"
                        :key="item.key ?? `invoice-stat-${itemIndex}`"
                        type="button"
                        class="dashboard-progress-row"
                        :class="{ 'dashboard-progress-row-active': dashboard.invoiceFilter === item.key }"
                        @click="dashboard.toggleInvoiceFilter(item.key)"
                    >
                        <span class="flex items-center gap-2 text-sm">
                            <i :class="item.icon" />
                            <span>{{ item.label }}</span>
                        </span>
                        <div class="h-2.5 overflow-hidden rounded-full bg-rosewood-secondary/25">
                            <div
                                class="h-full rounded-full transition-all duration-300"
                                :style="{ width: dashboard.invoiceBarWidth(item.value), background: item.color }"
                            />
                        </div>
                        <strong class="text-sm">{{ item.value }}</strong>
                    </button>
                </div>
            </article>
        </section>

        <section class="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.2fr]">
            <article class="dashboard-panel">
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 class="m-0 text-base text-rosewood">
                        Recent Activity
                    </h2>
                    <div class="dashboard-segment">
                        <button
                            v-for="filter in ['all', 'billing', 'operations']"
                            :key="filter"
                            type="button"
                            class="dashboard-segment-button"
                            :class="{ 'dashboard-segment-button-active': dashboard.activityFilter === filter }"
                            @click="dashboard.setActivityFilter(filter)"
                        >
                            {{ filter === 'all' ? 'All' : filter === 'billing' ? 'Billing' : 'Ops' }}
                        </button>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <div
                        v-for="(item, itemIndex) in safeActivity"
                        :key="item.id ?? `activity-${itemIndex}`"
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
                    </div>
                </div>
            </article>

            <article class="dashboard-panel">
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 class="m-0 text-base text-rosewood">
                        Quick Actions
                    </h2>
                    <input
                        v-model="dashboard.quickActionQuery"
                        type="search"
                        class="dashboard-search"
                        placeholder="Search actions..."
                    >
                </div>

                <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <router-link
                        v-for="(action, actionIndex) in safeQuickActions"
                        :key="action.label ?? action.to ?? `quick-action-${actionIndex}`"
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

                <DashboardEmptyState
                    v-if="safeQuickActions.length === 0"
                    title="No actions found"
                    message="No quick actions match your search."
                    icon="pi pi-search"
                />
            </article>
        </section>
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>
