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

        <div v-if="filterOptions.length > 1" class="customer-portal-filter-row">
            <button
                v-for="option in filterOptions"
                :key="option.value"
                type="button"
                class="customer-portal-filter-chip"
                :class="{ 'is-active': activeFilter === option.value }"
                @click="activeFilter = option.value"
            >
                {{ option.label }}
                <span>{{ option.count }}</span>
            </button>
        </div>

        <Loading v-if="isLoading" />

        <div v-else-if="filteredNotifications.length" class="customer-portal-notification-feed">
            <button
                v-for="item in filteredNotifications"
                :key="item.id || `${item.type}-${item.resource_id}-${item.created_at}`"
                type="button"
                class="customer-record-row customer-portal-notification-feed-item customer-notification-row"
                :class="{ 'is-unread': isNotificationUnread(item) }"
                @click="openNotification(item)"
            >
                <span class="customer-record-cell customer-record-primary customer-notification-primary">
                    <span class="customer-portal-icon-badge customer-portal-icon-badge--round" :class="notificationTone(item.type)">
                        <i :class="notificationIcon(item.type)" aria-hidden="true" />
                    </span>

                    <span class="customer-portal-notification-feed-copy">
                        <span class="customer-portal-notification-type-badge">{{ item.type }}</span>
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.message }}</small>
                    </span>
                </span>

                <span class="customer-record-cell customer-record-meta customer-notification-meta">
                    <time>{{ formatDisplayDateTime(item.created_at) }}</time>
                    <span class="customer-notification-read-state">
                        {{ isNotificationUnread(item) ? 'Unread' : 'Read' }}
                    </span>
                    <span
                        v-if="isNotificationUnread(item)"
                        class="customer-portal-unread-dot"
                        aria-hidden="true"
                    />
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
    filteredNotifications,
    unreadCount,
    activeFilter,
    filterOptions,
    openNotification,
    formatDisplayDateTime,
    notificationIcon,
    notificationTone,
    isNotificationUnread,
} = useCustomerNotificationList();
</script>
