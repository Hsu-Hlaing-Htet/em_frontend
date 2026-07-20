import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerDashboardStore = defineStore('customerDashboardStore', {
    state: () => ({
        dashboardResponse: null,
    }),

    getters: {
        getDashboardResponse(state) {
            return state.dashboardResponse;
        },
    },

    actions: {
        async fetchDashboard() {
            this.dashboardResponse = await service.getDashboard();
        },
    },
});
