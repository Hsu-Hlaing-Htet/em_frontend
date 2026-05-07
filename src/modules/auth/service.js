import api from '@/services/api';

export function getCurrentUser() {
    return api.get('/api/auth/me');
}

export function loginUser(payload) {
    return api.post('/api/auth/login', payload);
}

export function logoutUser() {
    return api.post('/api/auth/logout');
}

export function verifyToken(payload) {
    return api.post('/api/auth/verify-token', payload);
}

export function setPassword(token, payload) {
    return api.post(`/api/auth/set-password/${token}`, payload);
}

export const authService = { verifyToken, setPassword };
