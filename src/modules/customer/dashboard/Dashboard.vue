<template>
    <div v-if="!isLoading" class="customer-portal-home">
        <section class="customer-portal-hero" aria-label="Welcome">
            <div class="customer-portal-hero-media" aria-hidden="true">
                <img
                    class="customer-portal-hero-image"
                    src="@/assets/images/customer-dashboard-hero.jpg"
                    alt=""
                >
            </div>
            <div class="customer-portal-hero-overlay" aria-hidden="true" />
            <div class="customer-portal-hero-copy">
                <p class="customer-portal-hero-eyebrow">{{ $t('customer.welcomeBackEyebrow') }}</p>
                <h1 class="customer-portal-hero-title">{{ customerName || $t('customer.customerFallback') }}</h1>
                <p class="customer-portal-hero-lead">{{ $t('customer.dashboardLead') }}</p>
                <div v-if="propertyLine" class="customer-portal-hero-property">
                    <i class="pi pi-map-marker customer-portal-hero-property-icon" aria-hidden="true" />
                    <span>{{ propertyLine }}</span>
                </div>
            </div>
        </section>

        <section class="customer-portal-feature-grid">
            <router-link
                :to="contractListRoute"
                class="customer-interactive-surface customer-portal-contract-card customer-portal-card--interactive customer-portal-contract-card--link customer-portal-contract-card--summary"
            >
                <div class="customer-portal-card-media" aria-hidden="true">
                    <img
                        class="customer-portal-card-media-image"
                        src="@/assets/images/customer-card-contract.jpg"
                        alt=""
                    >
                </div>
                <div class="customer-portal-contract-summary">
                    <div class="customer-portal-contract-summary-head">
                        <p class="customer-portal-card-eyebrow">{{ $t('customer.activeContracts') }}</p>
                        <span class="customer-portal-contract-summary-cue" aria-hidden="true">›</span>
                    </div>
                    <h2 class="customer-portal-contract-summary-title">{{ activeContractSummaryTitle }}</h2>
                    <p class="customer-portal-card-copy">{{ activeContractSummaryLead }}</p>
                </div>
            </router-link>

            <article class="customer-portal-help-card">
                <div class="customer-portal-card-media customer-portal-card-media--help" aria-hidden="true">
                    <img
                        class="customer-portal-card-media-image"
                        src="@/assets/images/customer-card-help.jpg"
                        alt=""
                    >
                </div>
                <div class="customer-portal-help-copy">
                    <p class="customer-portal-card-eyebrow">{{ $t('customer.helpTitle') }}</p>
                    <h2>{{ $t('customer.helpHeading') }}</h2>
                    <p class="customer-portal-card-copy">{{ $t('customer.helpLead') }}</p>

                    <router-link
                        :to="{ name: 'customerNewMaintenanceRequest' }"
                        class="customer-portal-help-cta"
                    >
                        <i class="pi pi-wrench" aria-hidden="true" />
                        <span>{{ $t('customer.requestMaintenance') }}</span>
                        <i class="pi pi-arrow-right" aria-hidden="true" />
                    </router-link>

                    <router-link
                        to="/contact"
                        class="customer-portal-help-contact"
                    >
                        <i class="pi pi-headphones" aria-hidden="true" />
                        <span>{{ $t('customer.contactCustomerService') }}</span>
                    </router-link>
                </div>
            </article>
        </section>

        <section class="customer-portal-quick-actions" :aria-label="$t('customer.quickActions')">
            <router-link
                v-for="action in quickActions"
                :key="action.key"
                :to="action.to"
                class="customer-interactive-surface customer-portal-quick-action customer-portal-card customer-portal-card--interactive"
            >
                <div class="customer-portal-quick-action-head">
                    <h3>{{ action.title }}</h3>
                    <span class="customer-portal-icon-badge" :class="action.tone">
                        <i :class="action.icon" aria-hidden="true" />
                    </span>
                </div>
                <p>{{ action.description }}</p>
                <span class="customer-portal-action-link">
                    {{ action.action }}
                </span>
            </router-link>
        </section>

        <section class="customer-portal-bottom-grid">
            <article class="customer-portal-panel">
                <div class="customer-portal-panel-head">
                    <h2>{{ $t('customer.latestNotifications') }}</h2>
                    <router-link
                        :to="{ name: 'customerNotificationList' }"
                        class="customer-portal-action-link"
                    >
                        {{ $t('common.viewAll') }} <i class="pi pi-arrow-right" aria-hidden="true" />
                    </router-link>
                </div>

                <div v-if="latestNotifications.length" class="customer-portal-notification-list">
                    <button
                        v-for="item in latestNotifications"
                        :key="item.id || `${item.type}-${item.resource_id}-${item.created_at}`"
                        type="button"
                        class="customer-interactive-surface customer-portal-notification-item"
                        :class="{ 'is-unread': isNotificationUnread(item) }"
                        @click="openNotification(item)"
                    >
                        <span class="customer-portal-notification-main">
                            <span class="customer-portal-notification-copy">
                                <span class="customer-portal-notification-type-row">
                                    <span
                                        class="customer-portal-notification-type-icon"
                                        :class="notificationTone(item.type)"
                                        aria-hidden="true"
                                    >
                                        <i :class="notificationIcon(item.type)" />
                                    </span>
                                    <span
                                        v-if="item.type"
                                        class="customer-portal-notification-type-label"
                                    >
                                        {{ item.type }}
                                    </span>
                                </span>
                                <strong>{{ item.title }}</strong>
                                <small v-if="item.message">{{ item.message }}</small>
                            </span>
                        </span>

                        <span class="customer-portal-notification-aside">
                            <time
                                v-if="item.created_at"
                                class="rw-date"
                            >{{ formatDisplayDateTime(item.created_at) }}</time>
                            <span
                                v-if="isNotificationUnread(item)"
                                class="customer-notification-unread-inline"
                            >
                                <span class="customer-notification-read-state">UNREAD</span>
                                <span class="customer-portal-unread-dot" aria-hidden="true" />
                            </span>
                        </span>
                    </button>
                </div>

                <CustomerEmptyState
                    v-else
                    icon="pi pi-bell"
                    :title="$t('customer.noNotificationsTitle')"
                    :message="$t('customer.noNotificationsMessage')"
                />
            </article>

            <article class="customer-portal-panel">
                <div class="customer-portal-panel-head">
                    <h2>{{ $t('customer.overdueInvoices') }}</h2>
                    <router-link
                        :to="{ name: 'customerInvoiceList' }"
                        class="customer-portal-action-link"
                    >
                        {{ $t('customer.viewAllInvoices') }} <i class="pi pi-arrow-right" aria-hidden="true" />
                    </router-link>
                </div>

                <div v-if="overdueInvoices.length" class="customer-portal-overdue-list">
                    <button
                        v-for="invoice in overdueInvoices"
                        :key="invoice.id"
                        type="button"
                        class="customer-interactive-surface customer-portal-overdue-row"
                        @click="openInvoice(invoice.id)"
                    >
                        <span class="customer-portal-overdue-main">
                            <span class="customer-portal-overdue-title">
                                <template v-if="invoice.type && invoice.invoice_number">
                                    {{ invoice.type }} · {{ invoice.invoice_number }}
                                </template>
                                <template v-else>
                                    {{ invoice.type || invoice.invoice_number || $t('customer.invoicePayment') }}
                                </template>
                            </span>
                            <strong class="customer-portal-overdue-amount rw-numeric rw-money">
                                {{ formatMoney(invoice.remaining_balance ?? invoice.total_amount) }}
                            </strong>
                        </span>

                        <span class="customer-portal-overdue-aside">
                            <time
                                v-if="invoice.due_date"
                                class="rw-numeric rw-date"
                            >{{ formatDisplayDate(invoice.due_date) }}</time>
                            <StatusBadge value="overdue" />
                        </span>

                        <i
                            class="pi pi-chevron-right customer-portal-overdue-chevron"
                            aria-hidden="true"
                        />
                    </button>

                    <div class="customer-portal-outstanding">
                        <span>{{ $t('customer.outstandingBalance') }}</span>
                        <strong class="rw-numeric rw-money">{{ formatMoney(outstandingBalance) }}</strong>
                    </div>
                </div>

                <div
                    v-else
                    class="rounded-[3px] border border-[var(--admin-border)] bg-[var(--admin-surface-solid)] px-4 py-4"
                >
                    <p class="m-0 text-sm text-[var(--admin-text)]">
                        {{ $t('customer.noOverdueInvoicesTitle') }}
                    </p>
                    <p class="mt-1 text-sm text-[var(--admin-text-muted)]">
                        {{ $t('customer.noOverdueInvoicesMessage') }}
                    </p>
                </div>
            </article>
        </section>
    </div>

    <Loading v-if="isLoading" />
</template>

<script setup>
import { computed } from 'vue';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerDashboard from '@/composables/customer/useCustomerDashboard';

const {
    isLoading,
    customerName,
    primaryActiveContract,
    activeContractSummaryTitle,
    activeContractSummaryLead,
    contractListRoute,
    latestNotifications,
    overdueInvoices,
    outstandingBalance,
    quickActions,
    formatMoney,
    formatDisplayDate,
    formatDisplayDateTime,
    notificationIcon,
    notificationTone,
    isNotificationUnread,
    openNotification,
    openInvoice,
} = useCustomerDashboard();

const propertyLine = computed(() => {
    const contract = primaryActiveContract.value;

    if (!contract) {
        return '';
    }

    const building = contract.building_name?.trim();
    const room = contract.room_number?.trim();

    if (building && room) {
        return `${building} • Unit ${room}`;
    }

    if (building) {
        return building;
    }

    if (room) {
        return `Unit ${room}`;
    }

    return '';
});
</script>
