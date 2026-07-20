import { defineStore } from 'pinia';
import { service } from './service';

export const useProfileStore = defineStore('useProfileStore', {
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
        async fetchProfile(id) {
            const response = await service.getStaffProfile(id);
            this.profileResponse = response;
        },

        async updateProfile(params) {
            const response = await service.updateProfile(params);
            this.updateResponse = response;
        },
    },
});
