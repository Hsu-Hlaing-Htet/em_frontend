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

export default function useCustomerNotificationList() {
    const notificationStore = useCustomerNotificationStore();
    const router = useRouter();
    const { locale } = useI18n();
    const isLoading = ref(true);

    const notifications = computed(() => notificationStore.notifications);
    const unreadCount = computed(() => notificationStore.unreadCount);

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
        notificationStore.markAsRead(item?.id);

        const target = customerNotificationRoute(item);

        if (target) {
            router.push(target);
        }
    };

    const formatDisplayDateTime = (value) => formatRelativeTime(
        value,
        locale.value === 'my' ? 'my-MM' : 'en-GB',
    );

    return {
        isLoading,
        notifications,
        unreadCount,
        openNotification,
        formatDisplayDateTime,
        notificationIcon: customerNotificationIcon,
        notificationTone: customerNotificationTone,
        isNotificationUnread: isCustomerNotificationUnread,
    };
}
