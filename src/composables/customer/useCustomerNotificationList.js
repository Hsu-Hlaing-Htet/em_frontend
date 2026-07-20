import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerNotificationStore } from '@/modules/customer/notifications/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerNotificationList() {
    const store = useCustomerNotificationStore();
    const router = useRouter();
    const isLoading = ref(true);
    const notifications = ref([]);

    onMounted(async () => {
        isLoading.value = true;

        try {
            await store.fetchAll();
            notifications.value = cloneRows(store.getAllResponse?.data);
        } catch (error) {
            showApiErrorToast(error, 'Unable to load notifications.');
        } finally {
            isLoading.value = false;
        }
    });

    const openNotification = (item) => {
        if (item.type === 'invoice') {
            router.push({ name: 'customerShowInvoice', params: { id: item.resource_id } });
            return;
        }

        if (item.type === 'payment') {
            router.push({ name: 'customerShowInvoice', params: { id: item.resource_id } });
            return;
        }

        if (item.type === 'receipt') {
            router.push({ name: 'customerShowReceipt', params: { id: item.resource_id } });
            return;
        }

        if (item.type === 'contract') {
            router.push({ name: 'customerShowContract', params: { id: item.resource_id } });
        }
    };

    return { isLoading, notifications, openNotification };
}
