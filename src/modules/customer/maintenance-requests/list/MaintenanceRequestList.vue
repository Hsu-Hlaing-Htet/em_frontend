<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.maintenance')"
            :subtitle="$t('customer.maintenanceLead')"
        >
            <template #actions>
                <router-link :to="{ name: 'customerNewMaintenanceRequest' }">
                    <Button :label="$t('customer.newRequest')" icon="pi pi-plus" size="small" />
                </router-link>
            </template>
        </CustomerPageHeader>

        <div class="customer-portal-filter-row" role="group" :aria-label="$t('customer.maintenance')">
            <button
                v-for="filter in statusFilters"
                :key="filter.value || 'all'"
                type="button"
                class="customer-portal-filter-chip"
                :class="{ 'is-active': status === filter.value }"
                @click="status = filter.value"
            >
                {{ filter.label }}
            </button>
        </div>

        <Loading v-if="isLoading" />

        <div v-else-if="requests.length" class="customer-record-list">
            <router-link
                v-for="request in requests"
                :key="request.id"
                :to="{ name: 'customerShowMaintenanceRequest', params: { id: request.id } }"
                class="customer-interactive-surface customer-record-row customer-maintenance-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <strong v-if="request.title">{{ request.title }}</strong>
                    <small v-if="formatMaintenanceMeta(request)">{{ formatMaintenanceMeta(request) }}</small>
                </span>
                <span class="customer-record-cell customer-record-meta">
                    <time
                        v-if="createdAtParts(request.created_at)"
                        class="customer-record-created rw-date"
                        :datetime="request.created_at"
                    >
                        <span class="customer-record-created-date">{{ createdAtParts(request.created_at).date }}</span>
                        <span class="customer-record-created-sep" aria-hidden="true"> · </span>
                        <span class="customer-record-created-time">{{ createdAtParts(request.created_at).time }}</span>
                    </time>
                    <StatusBadge v-if="request.status" :value="request.status" />
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
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerMaintenanceRequestList from '@/composables/customer/useCustomerMaintenanceRequestList';
import { formatCustomerDateTimeParts } from '@/helpers/customer/datetime';

function formatMaintenanceMeta(request) {
    const room = request?.room_number ? `Room ${request.room_number}` : '';
    const category = request?.category || '';

    if (room && category) {
        return `${room} · ${category}`;
    }

    return room || category || '';
}

export default defineComponent({
    name: 'CustomerMaintenanceRequestList',
    components: {
        Button,
        Loading,
        StatusBadge,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return {
            ...useCustomerMaintenanceRequestList(),
            createdAtParts: formatCustomerDateTimeParts,
            formatMaintenanceMeta,
        };
    },
});
</script>
