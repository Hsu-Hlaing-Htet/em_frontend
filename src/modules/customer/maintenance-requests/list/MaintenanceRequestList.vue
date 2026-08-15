<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header customer-list-page-header--actions">
            <div>
                <h1 class="customer-page-heading">{{ $t('customer.maintenance') }}</h1>
                <p class="customer-page-lead">{{ $t('customer.maintenanceLead') }}</p>
            </div>
            <router-link :to="{ name: 'customerNewMaintenanceRequest' }">
                <Button :label="$t('customer.newRequest')" icon="pi pi-plus" size="small" />
            </router-link>
        </header>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            class="customer-list-toolbar"
            :placeholder="$t('customer.maintenanceSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="requests.length" class="customer-record-list">
            <router-link
                v-for="request in requests"
                :key="request.id"
                :to="{ name: 'customerShowMaintenanceRequest', params: { id: request.id } }"
                class="customer-record-row customer-maintenance-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ $t('customer.maintenanceRequest') }} #{{ request.id }}</span>
                    <strong>{{ request.title }}</strong>
                    <small>{{ request.category || 'general' }}</small>
                </span>
                <span class="customer-record-cell">
                    <span class="customer-record-label">{{ $t('customer.building') }} / {{ $t('customer.room') }}</span>
                    <strong>{{ request.building_name || '—' }}</strong>
                    <small>{{ $t('customer.room') }} {{ request.room_number || '—' }}</small>
                </span>
                <span class="customer-record-cell">
                    <span class="customer-record-label">{{ $t('customer.priority') }}</span>
                    <strong>{{ request.priority || 'medium' }}</strong>
                </span>
                <span class="customer-record-status">
                    <span class="customer-record-label">{{ $t('customer.status') }}</span>
                    <StatusBadge :value="request.status" />
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
            icon="pi pi-wrench"
            :title="$t('customer.noMaintenanceTitle')"
            :message="$t('customer.noMaintenanceMessage')"
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
import useCustomerMaintenanceRequestList from '@/composables/customer/useCustomerMaintenanceRequestList';

export default defineComponent({
    name: 'CustomerMaintenanceRequestList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerSearchBar,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerMaintenanceRequestList();
    },
});
</script>
