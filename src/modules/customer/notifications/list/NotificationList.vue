<template>
    <div>
        <h1 class="customer-page-heading">{{ $t('customer.notifications') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.notificationsLead') }}</p>

        <Loading v-if="isLoading" />

        <div v-else-if="notifications.length" class="customer-list-stack">
            <button
                v-for="item in notifications"
                :key="`${item.type}-${item.resource_id}-${item.created_at}`"
                type="button"
                class="customer-notification-card text-left"
                :class="{ 'is-unread': item.status !== 'read' }"
                @click="openNotification(item)"
            >
                <div class="mb-2 flex items-start justify-between gap-3">
                    <div>
                        <p class="m-0 mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--admin-primary)]">
                            {{ item.type }}
                        </p>
                        <h3 class="m-0 text-base font-bold">{{ item.title }}</h3>
                    </div>
                    <StatusBadge :value="item.status" />
                </div>
                <p class="m-0 mb-2 text-sm text-[var(--admin-text-muted)]">{{ item.message }}</p>
                <p class="m-0 text-xs text-[var(--admin-text-muted)]">{{ item.created_at }}</p>
            </button>
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-bell"
            :title="$t('customer.noNotificationsTitle')"
            :message="$t('customer.noNotificationsMessage')"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerNotificationList from '@/composables/customer/useCustomerNotificationList';

export default defineComponent({
    name: 'CustomerNotificationList',
    components: { Loading, StatusBadge, CustomerEmptyState },
    setup() {
        return useCustomerNotificationList();
    },
});
</script>
