<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.notifications')"
            :subtitle="$t('customer.notificationsLead')"
        >
            <template v-if="unreadCount" #actions>
                <p class="customer-portal-unread-summary m-0">
                    {{ $t('customer.unreadNotifications', { count: unreadCount }) }}
                </p>
            </template>
        </CustomerPageHeader>

        <Loading v-if="isLoading" />

        <div v-else-if="notifications.length" class="customer-portal-notification-feed">
            <button
                v-for="item in notifications"
                :key="item.id || `${item.type}-${item.resource_id}-${item.created_at}`"
                type="button"
                class="customer-interactive-surface customer-record-row customer-portal-notification-feed-item customer-notification-row"
                :class="{ 'is-unread': isNotificationUnread(item) }"
                @click="openNotification(item)"
            >
                <span class="customer-record-cell customer-record-primary customer-notification-primary">
                    <span class="customer-portal-notification-feed-copy">
                        <span class="customer-portal-notification-type-row">
                            <span
                                class="customer-portal-notification-type-icon"
                                :class="notificationTone(item.type)"
                                aria-hidden="true"
                            >
                                <i :class="notificationIcon(item.type)" />
                            </span>
                            <span v-if="item.type" class="customer-portal-notification-type-label">
                                {{ item.type }}
                            </span>
                        </span>
                        <strong v-if="item.title">{{ item.title }}</strong>
                        <small v-if="item.message">{{ item.message }}</small>
                    </span>
                </span>

                <span class="customer-record-cell customer-record-meta customer-notification-meta">
                    <time
                        v-if="item.created_at"
                        class="customer-notification-time"
                    >{{ formatDisplayDateTime(item.created_at) }}</time>
                    <span
                        v-if="isNotificationUnread(item)"
                        class="customer-notification-unread-inline"
                    >
                        <span class="customer-notification-read-state">UNREAD</span>
                        <span class="customer-portal-unread-dot" aria-hidden="true" />
                    </span>
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

<script setup>
import Loading from '@/components/global/Loading.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerNotificationList from '@/composables/customer/useCustomerNotificationList';

const {
    isLoading,
    notifications,
    unreadCount,
    openNotification,
    formatDisplayDateTime,
    notificationIcon,
    notificationTone,
    isNotificationUnread,
} = useCustomerNotificationList();
</script>
