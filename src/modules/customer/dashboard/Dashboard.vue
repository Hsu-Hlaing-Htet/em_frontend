<template>
    <div v-if="!isLoading">
        <h1 class="customer-page-heading">Dashboard</h1>
        <p class="customer-page-lead">Your payment overview at a glance</p>

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
            <h2 class="customer-section-title">Quick Actions</h2>
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
                <h2 class="customer-section-title m-0">Recent Transactions</h2>
                <router-link to="/customer/payments" class="text-sm font-semibold text-[var(--admin-primary)]">
                    View all
                </router-link>
            </div>

            <div v-if="recentPayments.length" class="customer-list-stack">
                <CustomerTransactionCard
                    v-for="payment in recentPayments"
                    :key="payment.id"
                    :transaction-id="payment.payment_number"
                    :title="payment.invoice_number || 'Payment'"
                    :amount="payment.amount"
                    :subtitle="`${payment.payment_date || '—'} · ${payment.payment_method_name || 'Method pending'}`"
                    :status="payment.status"
                    @select="openPayment(payment)"
                />
            </div>
            <CustomerEmptyState
                v-else
                icon="pi pi-wallet"
                title="No transactions yet"
                message="Your recent payments will appear here."
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
