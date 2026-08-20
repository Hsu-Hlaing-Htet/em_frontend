import { defineStore } from 'pinia';
import { service } from '../service';
import { isCustomerNotificationUnread } from '@/helpers/customer/notifications';

export const useCustomerNotificationStore = defineStore('customerNotificationStore', {
    state: () => ({
        listResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },

        notifications(state) {
            return Array.isArray(state.listResponse?.data) ? state.listResponse.data : [];
        },

        latestNotifications(state) {
            const rows = Array.isArray(state.listResponse?.data) ? state.listResponse.data : [];

            return rows.slice(0, 5);
        },

        unreadCount(state) {
            const rows = Array.isArray(state.listResponse?.data) ? state.listResponse.data : [];

            return rows.filter(isCustomerNotificationUnread).length;
        },
    },

    actions: {
        async fetchAll() {
            this.listResponse = await service.getNotifications();
        },

        /**
         * Allows other UI parts (e.g. Dashboard) to seed the store from an
         * already-fetched response, so header badge updates stay in sync.
         */
        setAllResponse(response) {
            this.listResponse = response;
        },

        /**
         * Client-side "mark as read" (no backend endpoint exists).
         * We update local store state so the unread dot and header count react immediately.
         */
        markAsRead(notificationId) {
            const listData = this.listResponse?.data;

            if (!Array.isArray(listData)) {
                return;
            }

            const target = listData.find((item) => item?.id === notificationId);

            if (target) {
                target.status = 'read';
            }
        },
    },
});
