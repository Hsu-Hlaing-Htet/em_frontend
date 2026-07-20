import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerProfileStore = defineStore('customerProfileStore', {
    state: () => ({
        profileResponse: null,
        updateResponse: null,
    }),

    getters: {
        getProfileResponse(state) {
            return state.profileResponse;
        },
        getUpdateResponse(state) {
            return state.updateResponse;
        },
    },

    actions: {
        async fetchProfile() {
            this.profileResponse = await service.getProfile();
        },

        async updateProfile(params) {
            this.updateResponse = await service.updateProfile(params);
        },
    },
});
