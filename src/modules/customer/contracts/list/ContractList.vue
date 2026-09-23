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
                class="customer-interactive-surface customer-record-row customer-contract-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <strong class="customer-contract-title">{{ formatContractTypeLabel(contract.type) }}</strong>
                    <small v-if="formatPropertyLabel(contract)" class="customer-contract-property">
                        {{ formatPropertyLabel(contract) }}
                    </small>
                </span>

                <span class="customer-record-cell customer-record-meta customer-contract-meta">
                    <StatusBadge v-if="contract.status" :value="contract.status" />
                    <strong
                        v-if="formatContractListAmount(contract)"
                        class="customer-contract-amount rw-numeric rw-money"
                    >
                        {{ formatContractListAmount(contract) }}
                    </strong>
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
import {
    formatContractTypeLabel,
    formatPropertyLabel,
} from '@/helpers/customer/notifications';
import { formatCurrency } from '@/utils/formatter';

function hasAmount(value) {
    return value !== null && value !== undefined && value !== '';
}

function resolveRentMonthlyAmount(contract) {
    if (hasAmount(contract?.room_price)) {
        return Number(contract.room_price);
    }

    if (hasAmount(contract?.estimated_monthly_payment)) {
        return Number(contract.estimated_monthly_payment);
    }

    if (hasAmount(contract?.room?.rent_price)) {
        return Number(contract.room.rent_price);
    }

    return null;
}

function formatContractListAmount(contract) {
    if (contract?.type === 'rent') {
        const monthly = resolveRentMonthlyAmount(contract);

        if (monthly === null || Number.isNaN(monthly)) {
            return '';
        }

        return `${formatCurrency(monthly)} / month`;
    }

    if (hasAmount(contract?.contract_total)) {
        return formatCurrency(Number(contract.contract_total));
    }

    return '';
}

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
        return {
            ...useCustomerContractList(),
            formatContractTypeLabel,
            formatPropertyLabel,
            formatContractListAmount,
        };
    },
});
</script>
