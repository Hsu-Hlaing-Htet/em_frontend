<template>
    <div class="customer-portal-page">
        <header class="customer-portal-page-header">
            <div>
                <h1 class="customer-portal-page-title">{{ $t('customer.notifications') }}</h1>
                <p class="customer-portal-page-lead">{{ $t('customer.notificationsLead') }}</p>
            </div>

            <p v-if="unreadCount" class="customer-portal-unread-summary">
                {{ $t('customer.unreadNotifications', { count: unreadCount }) }}
            </p>
        </header>

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
                class="customer-portal-notification-feed-item"
                :class="{ 'is-unread': isNotificationUnread(item) }"
                @click="openNotification(item)"
            >
                <span class="customer-portal-icon-badge customer-portal-icon-badge--round" :class="notificationTone(item.type)">
                    <i :class="notificationIcon(item.type)" aria-hidden="true" />
                </span>

                <span class="customer-portal-notification-feed-copy">
                    <span class="customer-portal-notification-type-badge">{{ item.type }}</span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.message }}</small>
                    <time>{{ formatDisplayDateTime(item.created_at) }}</time>
                </span>

                <span
                    v-if="isNotificationUnread(item)"
                    class="customer-portal-unread-dot"
                    aria-hidden="true"
                />
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
