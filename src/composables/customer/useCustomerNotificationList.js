import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerNotificationStore } from '@/modules/customer/notifications/store';
import { showApiErrorToast } from '@/utils/apiError';
import {
    customerNotificationIcon,
    customerNotificationRoute,
    customerNotificationTone,
    formatRelativeTime,
    isCustomerNotificationUnread,
} from '@/helpers/customer/notifications';

const FILTER_TYPES = ['all', 'invoice', 'payment', 'receipt', 'contract', 'maintenance', 'announcement'];

export default function useCustomerNotificationList() {
    const notificationStore = useCustomerNotificationStore();
    const router = useRouter();
    const { locale } = useI18n();
    const isLoading = ref(true);
    const activeFilter = ref('all');

    const filteredNotifications = computed(() => {
        if (activeFilter.value === 'all') {
            return notificationStore.notifications;
        }

        return notificationStore.notifications.filter((item) => item.type === activeFilter.value);
    });

    const unreadCount = computed(() => notificationStore.unreadCount);

    const filterOptions = computed(() => FILTER_TYPES.map((type) => ({
        value: type,
        label: type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1),
        count: type === 'all'
            ? notificationStore.notifications.length
            : notificationStore.notifications.filter((item) => item.type === type).length,
    })).filter((option) => option.value === 'all' || option.count > 0));

    onMounted(async () => {
        isLoading.value = true;

        try {
            if (!notificationStore.getAllResponse) {
                await notificationStore.fetchAll();
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load notifications.');
        } finally {
            isLoading.value = false;
        }
    });

    const openNotification = (item) => {
        const target = customerNotificationRoute(item);

        if (!target) {
            return;
        }

        notificationStore.markAsRead(item.id);
        router.push(target);
    };

    const formatDisplayDateTime = (value) => formatRelativeTime(
        value,
        locale.value === 'my' ? 'my-MM' : 'en-GB',
    );

    return {
        isLoading,
        notifications: computed(() => notificationStore.notifications),
        filteredNotifications,
        unreadCount,
        activeFilter,
        filterOptions,
        openNotification,
        formatDisplayDateTime,
        notificationIcon: customerNotificationIcon,
        notificationTone: customerNotificationTone,
        isNotificationUnread: isCustomerNotificationUnread,
    };
}
