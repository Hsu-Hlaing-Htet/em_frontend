<template>
    <div v-if="!isLoading" class="customer-dashboard">
        <header class="customer-dashboard-welcome">
            <div>
                <p class="customer-dashboard-eyebrow">{{ $t('customer.accountOverview') }}</p>
                <h1 class="customer-dashboard-title">
                    {{ $t('customer.welcomeBack', { name: customerName }) }}
                </h1>
                <p class="customer-dashboard-lead">{{ $t('customer.dashboardLead') }}</p>
            </div>
            <router-link to="/customer/profile" class="customer-dashboard-account-link">
                <i class="pi pi-user" aria-hidden="true" />
                {{ $t('customer.viewAccount') }}
            </router-link>
        </header>

        <section class="customer-dashboard-primary-grid" :aria-label="$t('customer.accountOverview')">
            <article v-for="card in primaryCards" :key="card.key" class="customer-dashboard-kpi" :class="`is-${card.tone}`">
                <div class="customer-dashboard-kpi-head">
                    <span class="customer-dashboard-kpi-icon"><i :class="card.icon" aria-hidden="true" /></span>
                    <span class="customer-dashboard-kpi-label">{{ card.label }}</span>
                </div>
                <p class="customer-dashboard-kpi-value">{{ card.value }}</p>
                <p class="customer-dashboard-kpi-detail">{{ card.detail }}</p>
                <router-link v-if="card.to" :to="card.to" class="customer-dashboard-card-link">
                    {{ card.action }} <i class="pi pi-arrow-right" aria-hidden="true" />
                </router-link>
            </article>
        </section>

        <section class="customer-dashboard-secondary-grid" :aria-label="$t('customer.accountSummary')">
            <article v-for="card in secondaryCards" :key="card.key" class="customer-dashboard-mini-card">
                <span class="customer-dashboard-mini-icon"><i :class="card.icon" aria-hidden="true" /></span>
                <div>
                    <p class="customer-dashboard-mini-label">{{ card.label }}</p>
                    <p class="customer-dashboard-mini-value">{{ card.value }}</p>
                </div>
            </article>
        </section>

        <section class="customer-dashboard-bottom-grid">
            <article class="customer-dashboard-panel">
                <div class="customer-dashboard-section-head">
                    <div>
                        <p class="customer-dashboard-eyebrow">{{ $t('customer.paymentHistory') }}</p>
                        <h2>{{ $t('customer.recentTransactions') }}</h2>
                    </div>
                    <router-link to="/customer/payments" class="customer-dashboard-view-all">
                        {{ $t('common.viewAll') }} <i class="pi pi-arrow-right" aria-hidden="true" />
                    </router-link>
                </div>

                <div v-if="recentPayments.length" class="customer-dashboard-transactions">
                    <button
                        v-for="payment in recentPayments"
                        :key="payment.id"
                        type="button"
                        class="customer-dashboard-transaction-row"
                        @click="openPayment(payment)"
                    >
                        <span class="customer-dashboard-transaction-date">{{ formatDisplayDate(payment.payment_date) }}</span>
                        <span class="customer-dashboard-transaction-reference">
                            <strong>{{ payment.invoice_number || $t('customer.payment') }}</strong>
                            <small>{{ payment.payment_method_name || $t('customer.methodPending') }}</small>
                        </span>
                        <span class="customer-dashboard-transaction-amount">{{ formatMoney(payment.amount) }}</span>
                        <StatusBadge :value="payment.status" />
                    </button>
                </div>

                <CustomerEmptyState
                    v-else
                    icon="pi pi-wallet"
                    :title="$t('customer.noTransactionsTitle')"
                    :message="$t('customer.noTransactionsMessage')"
                />
            </article>

            <article class="customer-dashboard-panel">
                <div class="customer-dashboard-section-head">
                    <div>
                        <p class="customer-dashboard-eyebrow">{{ $t('common.alerts') }}</p>
                        <h2>{{ $t('customer.latestNotifications') }}</h2>
                    </div>
                    <router-link to="/customer/notifications" class="customer-dashboard-view-all">
                        {{ $t('common.viewAll') }} <i class="pi pi-arrow-right" aria-hidden="true" />
                    </router-link>
                </div>

                <div v-if="latestNotifications.length" class="customer-dashboard-notifications">
                    <button
                        v-for="item in latestNotifications"
                        :key="item.id || `${item.type}-${item.resource_id}-${item.created_at}`"
                        type="button"
                        class="customer-dashboard-notification-row"
                        @click="openNotification(item)"
                    >
                        <span class="customer-dashboard-notification-icon">
                            <i :class="notificationIcon(item.type)" aria-hidden="true" />
                        </span>
                        <span class="customer-dashboard-notification-copy">
                            <strong>{{ item.title }}</strong>
                            <small>{{ item.message }}</small>
                            <time>{{ formatDisplayDateTime(item.created_at) }}</time>
                        </span>
                        <StatusBadge :value="item.status" :show-icon="false" />
                    </button>
                </div>

                <CustomerEmptyState
                    v-else
                    icon="pi pi-bell"
                    :title="$t('customer.noNotificationsTitle')"
                    :message="$t('customer.noNotificationsMessage')"
                />
            </article>
        </section>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerDashboard from '@/composables/customer/useCustomerDashboard';

export default defineComponent({
    name: 'CustomerDashboard',
    components: {
        Loading,
        StatusBadge,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerDashboard();
    },
});
</script>
