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

            // Latest N regardless of read/unread — visual state only changes when opened.
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
         * Optimistic local read — keep entity status intact for routing.
         */
        markAsReadLocal(notificationId) {
            const listData = this.listResponse?.data;

            if (!Array.isArray(listData) || !notificationId) {
                return;
            }

            const target = listData.find((item) => item?.id === notificationId);

            if (target && !target.read_at) {
                target.read_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            }
        },

        /**
         * Optimistic UI update + persist read_at via API.
         * Navigation should not wait on this call.
         */
        async markAsRead(notificationId) {
            this.markAsReadLocal(notificationId);

            if (!notificationId) {
                return;
            }

            try {
                const response = await service.markNotificationRead(notificationId);
                const readAt = response?.data?.read_at;

                if (readAt) {
                    const listData = this.listResponse?.data;
                    const target = Array.isArray(listData)
                        ? listData.find((item) => item?.id === notificationId)
                        : null;

                    if (target) {
                        target.read_at = readAt;
                    }
                }
            } catch {
                // Keep optimistic local read; next fetch will reconcile if needed.
            }
        },
    },
});
