<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header">
            <h1 class="customer-page-heading">{{ $t('customer.contracts') }}</h1>
            <p class="customer-page-lead">{{ $t('customer.contractsLead') }}</p>
        </header>

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
                </span>
                <span class="customer-record-cell">
                    <span class="customer-record-label">{{ $t('customer.building') }} / {{ $t('customer.room') }}</span>
                    <strong>{{ contract.building_name || '—' }}</strong>
                    <small>{{ $t('customer.room') }} {{ contract.room_number || '—' }}</small>
                </span>
                <span class="customer-record-cell customer-record-amount">
                    <span class="customer-record-label">{{ $t('customer.total') }}</span>
                    <strong>{{ formatCurrency(Number(contract.contract_total || 0)) }}</strong>
                </span>
                <span class="customer-record-status">
                    <span class="customer-record-label">{{ $t('customer.status') }}</span>
                    <StatusBadge :value="contract.status" />
                </span>
            </router-link>

            <Button
                v-if="hasMore()"
                :label="$t('common.loadMore')"
                class="customer-load-more customer-btn-primary"
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
import useCustomerContractList from '@/composables/customer/useCustomerContractList';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerContractList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerEmptyState,
    },
    setup() {
        return { ...useCustomerContractList(), formatCurrency };
    },
});
</script>
