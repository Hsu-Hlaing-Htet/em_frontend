import { defineStore } from "pinia";
import { useNotificationService } from "./notificationService";

export const useNotificationStore = defineStore({
  id: "useNotificationStore",
  state: () => ({
    listNotificationState: null,
    showNotificationState: null,
    showMarkAsSeenNotificationState: null,
    unseenCountNotificationState: null,
    sendPushyTokenState: null,
    markAsAllNotificationState: null,
  }),

  getters: {
    getAllNotification(state) {
      return state.listNotificationState;
    },
    getShowNotification(state) {
      return state.showNotificationState;
    },
    getShowMarkAsSeenNotification(state) {
      return state.showMarkAsSeenNotificationState;
    },
    getUnseenCountNotification(state) {
      return state.unseenCountNotificationState;
    },
    getSendPushyToken(state) {
      return state.sendPushyTokenState;
    },
    getMarkAsAllNotification(state) {
      return state.markAsAllNotificationState;
    },
  },

  actions: {
    async allNotificationAction(params) {
      const response = await useNotificationService.fetchAllNotification(
        params
      );
      this.listNotificationState = response;
    },
    async showNotificationAction(params) {
      const response = await useNotificationService.fetchShowNotification(
        params
      );
      this.showNotificationState = response;
    },
    async showMarkAsSeenNotificationAction(params) {
      const response =
        await useNotificationService.fetchShowMarkAsSeenNotification(params);
      this.showMarkAsSeenNotificationState = response;
    },
    async unseenCountNotificationAction(params) {
      const response = await useNotificationService.fetchUnseenCount(params);
      this.unseenCountNotificationState = response;
    },
    async sendPushyTokenAction(params) {
      const response = await useNotificationService.sendPushyToken(params);
      this.sendPushyTokenState = response;
    },
    async markAsAllNotificationAction() {
      this.markAsAllNotificationState =
        await useNotificationService.fetchMarkAsAllNotification();
    },
  },
});
