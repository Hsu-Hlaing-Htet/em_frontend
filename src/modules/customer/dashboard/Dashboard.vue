<template>
    <div v-if="!isLoading" class="customer-portal-home">
        <section class="customer-portal-hero">
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
                v-if="primaryActiveContract"
                :to="contractListRoute"
                class="customer-portal-contract-card customer-portal-card--interactive customer-portal-contract-card--link"
            >
                <div class="customer-portal-contract-card-head">
                    <div>
                        <p class="customer-portal-card-eyebrow">{{ $t('customer.activeContract') }}</p>
                        <h2>{{ formatPropertyLabel(primaryActiveContract) || '—' }}</h2>
                        <p class="customer-portal-contract-type">
                            {{ formatContractTypeLabel(primaryActiveContract.type) }}
                        </p>
                    </div>
                </div>

                <dl class="customer-portal-contract-meta">
                    <div>
                        <dt>{{ $t('customer.contractId') }}</dt>
                        <dd>{{ primaryActiveContract.contract_number || '—' }}</dd>
                    </div>
                    <div>
                        <dt>{{ $t('customer.startDate') }}</dt>
                        <dd>{{ formatDisplayDate(primaryActiveContract.start_date) }}</dd>
                    </div>
                    <div>
                        <dt>{{ $t('customer.endDate') }}</dt>
                        <dd>{{ formatDisplayDate(primaryActiveContract.end_date) }}</dd>
                    </div>
                    <div>
                        <dt>{{ $t('customer.status') }}</dt>
                        <dd><StatusBadge :value="primaryActiveContract.status" /></dd>
                    </div>
                </dl>
            </router-link>

            <router-link
                v-else
                :to="contractListRoute"
                class="customer-portal-contract-card customer-portal-card--interactive customer-portal-contract-card--link is-empty"
            >
                <p class="customer-portal-card-eyebrow">{{ $t('customer.activeContract') }}</p>
                <h2>{{ $t('customer.noActiveContracts') }}</h2>
                <p class="customer-portal-card-copy">{{ $t('customer.noActiveContractsLead') }}</p>
                <span class="customer-portal-action-link customer-portal-action-link--inverse">
                    {{ $t('customer.viewAllContracts') }}
                </span>
            </router-link>

            <article class="customer-portal-help-card">
                <p class="customer-portal-card-eyebrow">{{ $t('customer.helpTitle') }}</p>
                <h2>{{ $t('customer.helpHeading') }}</h2>
                <p class="customer-portal-card-copy">{{ $t('customer.helpLead') }}</p>

                <router-link
                    :to="{ name: 'customerNewMaintenanceRequest' }"
                    class="btn customer-portal-block-btn"
                >
                    {{ $t('customer.requestMaintenance') }}
                </router-link>

                <router-link
                    to="/contact"
                    class="customer-portal-action-link"
                >
                    <i class="pi pi-headphones" aria-hidden="true" />
                    {{ $t('customer.contactCustomerService') }}
                </router-link>
            </article>
        </section>

        <section class="customer-portal-quick-actions" :aria-label="$t('customer.quickActions')">
            <router-link
                v-for="action in quickActions"
                :key="action.key"
                :to="action.to"
                class="customer-portal-quick-action customer-portal-card customer-portal-card--interactive"
            >
                <span class="customer-portal-icon-badge" :class="action.tone">
                    <i :class="action.icon" aria-hidden="true" />
                </span>
                <h3>{{ action.title }}</h3>
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
                        class="customer-portal-notification-item"
                        :class="{ 'is-unread': isNotificationUnread(item) }"
                        @click="openNotification(item)"
                    >
                        <span class="customer-portal-icon-badge customer-portal-icon-badge--round" :class="notificationTone(item.type)">
                            <i :class="notificationIcon(item.type)" aria-hidden="true" />
                        </span>

                        <span class="customer-portal-notification-copy">
                            <strong>{{ item.title }}</strong>
                            <small>{{ item.message }}</small>
                            <time>{{ formatDisplayDateTime(item.created_at) }}</time>
                        </span>

                        <span
                            v-if="isNotificationUnread(item)"
                            class="customer-portal-unread-dot"
                            aria-hidden="true"
                        />
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

                <div v-if="overdueInvoices.length" class="flex flex-col gap-3">
                    <button
                        v-for="invoice in overdueInvoices"
                        :key="invoice.id"
                        type="button"
                        class="flex w-full items-center gap-3 rounded-[3px] border border-[var(--admin-border)] border-l-[3px] border-l-[var(--rw-danger)] bg-[var(--admin-surface-solid)] px-3 py-3 text-left transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-[color-mix(in_srgb,var(--rw-danger)_35%,var(--admin-border))] hover:bg-[color-mix(in_srgb,var(--admin-surface-solid)_92%,var(--rw-danger)_8%)] hover:shadow-[var(--admin-shadow)] focus-visible:border-[color-mix(in_srgb,var(--rw-danger)_35%,var(--admin-border))] focus-visible:bg-[color-mix(in_srgb,var(--admin-surface-solid)_92%,var(--rw-danger)_8%)] focus-visible:shadow-[var(--admin-shadow)] focus-visible:outline-none"
                        @click="openInvoice(invoice.id)"
                    >
                        <div class="min-w-0 flex-1">
                            <div class="mb-1 flex flex-wrap items-center gap-2">
                                <strong class="text-sm text-[var(--admin-text)]">
                                    {{ invoice.type || invoice.invoice_number || $t('customer.invoicePayment') }}
                                </strong>
                                <StatusBadge value="overdue" />
                            </div>
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--admin-text-muted)]">
                                <span>Due {{ formatDisplayDate(invoice.due_date) }}</span>
                                <span>{{ formatMoney(invoice.remaining_balance ?? invoice.total_amount) }}</span>
                            </div>
                        </div>

                        <i class="pi pi-chevron-right text-sm text-[var(--admin-text-muted)]" aria-hidden="true" />
                    </button>

                    <div class="customer-portal-outstanding">
                        <span>{{ $t('customer.outstandingBalance') }}</span>
                        <strong>{{ formatMoney(outstandingBalance) }}</strong>
                    </div>
                </div>

                <div
                    v-else
                    class="rounded-[3px] border border-[var(--admin-border)] bg-[var(--admin-surface-solid)] px-4 py-4"
                >
                    <p class="m-0 text-sm font-semibold text-[var(--admin-text)]">
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
    contractListRoute,
    latestNotifications,
    overdueInvoices,
    outstandingBalance,
    quickActions,
    formatMoney,
    formatDisplayDate,
    formatDisplayDateTime,
    formatContractTypeLabel,
    formatPropertyLabel,
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
