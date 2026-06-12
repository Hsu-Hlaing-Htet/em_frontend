import api from "@/libs/axios";
import qs from "qs";
import { endpoint } from "@/constants/endpoint";

const service = {
  getAll: async (params) => {
    try {
      const result = await api.get(`${endpoint.custom}`, {
        params: params,
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      });

      return result.data;
    } catch {
      return null;
    }
  },

  add: async (params) => {
    // const headers = { "Content-Type": "multipart/form-data" };
    const result = await api.post(`${endpoint.custom}`, params);
    return result.data;
  },

  getOne: async (params) => {
    try {
      const result = await api.get(`${endpoint.custom}/${params.id}`);
      return result.data;
    } catch {
      return null;
    }
  },

  update: async (params) => {
    // const headers = { "Content-Type": "multipart/form-data" };
    const result = await api.put(`${endpoint.custom}/${params.id}`, params);
    return result.data;
  },

  delete: async (params) => {
    try {
      const result = await api.delete(`${endpoint.custom}/${params.id}`);
      return result.data;
    } catch {
      return null;
    }
  },
};

export { service };