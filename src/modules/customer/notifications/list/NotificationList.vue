<template>
    <div class="customer-portal-page">
        <header class="customer-list-page-header">
            <h1 class="customer-page-heading">{{ $t('customer.notifications') }}</h1>
            <p class="customer-page-lead">{{ $t('customer.notificationsLead') }}</p>
        </header>

        <Loading v-if="isLoading" />

        <div v-else-if="notifications.length" class="customer-record-list">
            <button
                v-for="item in notifications"
                :key="`${item.type}-${item.resource_id}-${item.created_at}`"
                type="button"
                class="customer-record-row customer-notification-row"
                :class="{ 'is-unread': item.status !== 'read' }"
                @click="openNotification(item)"
            >
                <span class="customer-notification-type"><i :class="notificationIcon(item.type)" aria-hidden="true" /></span>
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ item.type }}</span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.message }}</small>
                </span>
                <span class="customer-record-cell customer-notification-time">
                    <span class="customer-record-label">{{ $t('customer.updated') }}</span>
                    <strong>{{ item.created_at || '—' }}</strong>
                </span>
                <span class="customer-record-status">
                    <span class="customer-record-label">{{ $t('customer.status') }}</span>
                    <StatusBadge :value="item.status" />
                </span>
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
        const notificationIcon = (type) => ({
            invoice: 'pi pi-file',
            payment: 'pi pi-wallet',
            receipt: 'pi pi-receipt',
            contract: 'pi pi-home',
        }[type] || 'pi pi-bell');

        return { ...useCustomerNotificationList(), notificationIcon };
    },
});
</script>
