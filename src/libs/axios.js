import api from '@/services/api';

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject({
        status: error.response?.status,
        data: error.response?.data,
    }),
);

export default api;
