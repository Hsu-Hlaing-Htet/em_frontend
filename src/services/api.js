import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set multipart boundary. A bare
    // Content-Type: multipart/form-data (or the default application/json)
    // breaks file uploads.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        if (typeof config.headers?.set === 'function') {
            config.headers.set('Content-Type', undefined);
        } else if (config.headers) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            window.location.reload();
        }

        if (error.response?.status === 401) {
            const path = window.location.pathname;
            const isAuthRoute = ['/login', '/forgot-password', '/reset-password'].some(
                (routePath) => path.startsWith(routePath),
            );

            if (!isAuthRoute) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                const redirect = encodeURIComponent(
                    `${path}${window.location.search}`,
                );

                window.location.assign(`/login?redirect=${redirect}`);
            }
        }

        if (error.response?.status === 403) {
            const path = window.location.pathname;

            if (!path.startsWith('/forbidden')) {
                const from = path.startsWith('/admin')
                    ? 'admin'
                    : path.startsWith('/customer')
                        ? 'customer'
                        : undefined;
                const query = from ? `?from=${from}` : '';

                window.location.assign(`/forbidden${query}`);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
