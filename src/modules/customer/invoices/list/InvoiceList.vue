<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.invoices')"
            :subtitle="$t('customer.invoicesLead')"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="invoices.length" class="customer-record-list">
            <router-link
                v-for="invoice in invoices"
                :key="invoice.id"
                :to="{ name: 'customerInvoiceDocument', params: { id: invoice.id } }"
                class="customer-interactive-surface customer-record-row customer-invoice-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ invoice.type || $t('customer.invoice') }}</span>
                    <strong v-if="invoice.invoice_number">{{ invoice.invoice_number }}</strong>
                    <small v-if="hasAmount(invoice.total_amount)">
                        {{ $t('customer.amount') }}
                        <span class="rw-numeric rw-money">{{ formatCurrency(Number(invoice.total_amount)) }}</span>
                    </small>
                </span>
                <span class="customer-record-cell customer-record-meta">
                    <time
                        v-if="createdAtParts(invoice.created_at)"
                        class="customer-record-created rw-date"
                        :datetime="invoice.created_at"
                    >
                        <span class="customer-record-created-date">{{ createdAtParts(invoice.created_at).date }}</span>
                        <span class="customer-record-created-sep" aria-hidden="true"> · </span>
                        <span class="customer-record-created-time">{{ createdAtParts(invoice.created_at).time }}</span>
                    </time>
                    <StatusBadge v-if="invoice.status" :value="invoice.status" />
                </span>
            </router-link>
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
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerInvoiceList from '@/composables/customer/useCustomerInvoiceList';
import { formatCustomerDateTimeParts } from '@/helpers/customer/datetime';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerInvoiceList',
    components: {
        Loading,
        StatusBadge,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        const hasAmount = (value) => value !== null && value !== undefined && value !== '';

        return {
            ...useCustomerInvoiceList(),
            formatCurrency,
            createdAtParts: formatCustomerDateTimeParts,
            hasAmount,
        };
    },
});
</script>
