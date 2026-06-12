import api from '@/services/api';

export function loginUser(payload) {
    return api.post('/api/auth/login', payload);
}

export function getCurrentUser() {
    return api.get('/api/auth/me');
}

export function logoutUser() {
    return api.post('/api/auth/logout');
}