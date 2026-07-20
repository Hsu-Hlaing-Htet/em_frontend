import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerNotificationStore = defineStore('customerNotificationStore', {
    state: () => ({
        listResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
    },

    actions: {
        async fetchAll() {
            this.listResponse = await service.getNotifications();
        },
    },
});
