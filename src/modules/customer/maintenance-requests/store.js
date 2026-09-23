import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerMaintenanceRequestStore = defineStore('customerMaintenanceRequestStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        roomsResponse: null,
        categoriesResponse: null,
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
        getCategoriesResponse(state) {
            return state.categoriesResponse;
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

        async fetchCategories() {
            this.categoriesResponse = await service.getMaintenanceCategories();
        },

        async create(params) {
            this.createResponse = await service.createMaintenanceRequest(params);
        },
    },
});
