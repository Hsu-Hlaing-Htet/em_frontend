import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerMaintenanceRequestStore = defineStore('customerMaintenanceRequestStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        roomsResponse: null,
        createResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.detailResponse;
        },
        getRoomsResponse(state) {
            return state.roomsResponse;
        },
        getCreateResponse(state) {
            return state.createResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            this.listResponse = await service.getMaintenanceRequests(params);
        },

        async fetchOne(params) {
            this.detailResponse = await service.getMaintenanceRequest(params);
        },

        async fetchRooms() {
            this.roomsResponse = await service.getMaintenanceRooms();
        },

        async create(params) {
            this.createResponse = await service.createMaintenanceRequest(params);
        },
    },
});
