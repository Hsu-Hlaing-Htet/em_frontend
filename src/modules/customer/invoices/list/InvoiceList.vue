<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header">
            <h1 class="customer-page-heading">{{ $t('customer.invoices') }}</h1>
            <p class="customer-page-lead">{{ $t('customer.invoicesLead') }}</p>
        </header>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            class="customer-list-toolbar"
            :placeholder="$t('customer.invoiceSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="invoices.length" class="customer-record-list">
            <router-link
                v-for="invoice in invoices"
                :key="invoice.id"
                :to="{ name: 'customerShowInvoice', params: { id: invoice.id } }"
                class="customer-record-row customer-invoice-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ $t('customer.invoice') }}</span>
                    <strong>{{ invoice.invoice_number || '—' }}</strong>
                    <small>{{ invoice.type || '—' }}</small>
                </span>
                <span class="customer-record-cell customer-record-amount">
                    <span class="customer-record-label">{{ $t('customer.amount') }}</span>
                    <strong>{{ formatCurrency(Number(invoice.total_amount || 0)) }}</strong>
                    <small>{{ $t('customer.paidAmount') }} {{ formatCurrency(Number(invoice.paid_amount || 0)) }}</small>
                </span>
                <span class="customer-record-cell">
                    <span class="customer-record-label">{{ $t('customer.dueDate') }}</span>
                    <strong>{{ invoice.due_date || '—' }}</strong>
                    <small>{{ invoice.billing_period || '—' }}</small>
                </span>
                <span class="customer-record-status">
                    <span class="customer-record-label">{{ $t('customer.status') }}</span>
                    <StatusBadge :value="invoice.status" />
                </span>
            </router-link>

            <Button
                v-if="hasMore()"
                :label="$t('common.loadMore')"
                class="customer-load-more btn"
                :loading="isLoadingMore"
                @click="loadMore"
            />
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-file"
            :title="$t('customer.noInvoicesTitle')"
            :message="$t('customer.noInvoicesMessage')"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerSearchBar from '@/components/customer/CustomerSearchBar.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerInvoiceList from '@/composables/customer/useCustomerInvoiceList';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerInvoiceList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerSearchBar,
        CustomerEmptyState,
    },
    setup() {
        return { ...useCustomerInvoiceList(), formatCurrency };
    },
});
</script>
