<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.contracts')"
            :subtitle="$t('customer.contractsLead')"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="contracts.length" class="customer-record-list">
            <router-link
                v-for="contract in contracts"
                :key="contract.id"
                :to="{ name: 'customerShowContract', params: { id: contract.id } }"
                class="customer-record-row customer-contract-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ $t('customer.contract') }}</span>
                    <strong>{{ contract.contract_number || '—' }}</strong>
                    <small>{{ contract.type || '—' }}</small>
                    <small>{{ $t('customer.room') }} {{ contract.room_number || '—' }}</small>
                </span>
                <span class="customer-record-cell customer-record-meta">
                    <span class="customer-record-label">{{ $t('customer.total') }} (MMK)</span>
                    <strong>{{ formatCurrency(Number(contract.contract_total || 0)) }}</strong>
                    <small>{{ contract.building_name || '—' }}</small>
                    <StatusBadge :value="contract.status" />
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
            icon="pi pi-home"
            :title="$t('customer.noContractsTitle')"
            :message="$t('customer.noContractsMessage')"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerContractList from '@/composables/customer/useCustomerContractList';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerContractList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return { ...useCustomerContractList(), formatCurrency };
    },
});
</script>
