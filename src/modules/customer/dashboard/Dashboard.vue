<template>
    <div v-if="!isLoading">
        <h1 class="customer-page-heading">{{ $t('customer.dashboard') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.dashboardLead') }}</p>

        <section class="customer-section">
            <div class="customer-stat-grid">
                <CustomerStatCard
                    v-for="card in statCards"
                    :key="card.label"
                    :label="card.label"
                    :value="card.value"
                    :icon="card.icon"
                />
            </div>
        </section>

        <section class="customer-section">
            <h2 class="customer-section-title">{{ $t('customer.quickActions') }}</h2>
            <div class="customer-quick-actions">
                <router-link
                    v-for="action in quickActions"
                    :key="action.label"
                    :to="action.to"
                    class="customer-quick-action"
                >
                    <i :class="action.icon" />
                    <span>{{ action.label }}</span>
                </router-link>
            </div>
        </section>

        <section class="customer-section">
            <div class="mb-3 flex items-center justify-between gap-3">
                <h2 class="customer-section-title m-0">{{ $t('customer.recentTransactions') }}</h2>
                <router-link to="/customer/payments" class="text-sm font-semibold text-[var(--admin-primary)]">
                    {{ $t('common.viewAll') }}
                </router-link>
            </div>

            <div v-if="recentPayments.length" class="customer-list-stack">
                <CustomerTransactionCard
                    v-for="payment in recentPayments"
                    :key="payment.id"
                    :transaction-id="payment.invoice_number"
                    :title="payment.invoice_number || $t('customer.payment')"
                    :amount="payment.amount"
                    :subtitle="`${payment.payment_date || '—'} · ${payment.payment_method_name || $t('customer.methodPending')}`"
                    :status="payment.status"
                    @select="openPayment(payment)"
                />
            </div>
            <CustomerEmptyState
                v-else
                icon="pi pi-wallet"
                :title="$t('customer.noTransactionsTitle')"
                :message="$t('customer.noTransactionsMessage')"
            />
        </section>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import CustomerStatCard from '@/components/customer/CustomerStatCard.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerDashboard from '@/composables/customer/useCustomerDashboard';

export default defineComponent({
    name: 'CustomerDashboard',
    components: {
        Loading,
        CustomerStatCard,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerDashboard();
    },
});
</script>
