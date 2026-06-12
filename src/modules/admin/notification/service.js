import api from "@/libs/axios";
import { endpoint } from "@/constants/endpoint";

const useNotificationService = {
  fetchAllNotification: async (params) => {
    try {
      const result = await api.get(endpoint.notifications, {
        params: params,
      });
      return result.data;
    } catch {
      return null;
    }
  },

  fetchShowNotification: async (params) => {
    try {
      const result = await api.get(`${endpoint.notifications}/${params.id}`);
      return result.data;
    } catch {
      return null;
    }
  },

  fetchShowMarkAsSeenNotification: async (params) => {
    try {
      const result = await api.put(
        `${endpoint.notifications}/${params.id}/mark-as-seen`
      );
      return result.data;
    } catch {
      return null;
    }
  },

  fetchUnseenCount: async () => {
    try {
      const result = await api.get(`${endpoint.notifications}/unseen-count`);
      return result.data;
    } catch {
      return null;
    }
  },

  sendPushyToken: async (params) => {
    try {
      const result = await api.post(
        `${endpoint.users}/store-pushy-token`,
        params
      );
      return result.data;
    } catch {
      return null;
    }
  },
  fetchMarkAsAllNotification: async () => {
    try {
      const result = await api.put(`${endpoint.notifications}/read-all`);
      return result.data;
    } catch {
      return null;
    }
  },
};

export { useNotificationService };
