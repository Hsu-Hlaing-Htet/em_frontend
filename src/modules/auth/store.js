import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, logoutUser, getCurrentUser } from './service';

function readStoredUser() {
    const raw = localStorage.getItem('user');

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref(readStoredUser());
    const token = ref(localStorage.getItem('token'));

    const isAuthenticated = computed(() => !!token.value);

    const role = computed(() => user.value?.role ?? null);

    async function login(email, password) {
        const { data } = await loginUser({
            email,
            password,
        });

        token.value = data.token;
        user.value = data.user;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        let redirect_to = '/customer/dashboard';

        if (
            data.user.role === 'super_admin' ||
            data.user.role === 'admin'
        ) {
            redirect_to = '/admin/dashboard';
        }

        const result = {
            ...data,
            redirect_to,
        };

        return result;
    }

    async function logout() {
        try {
            await logoutUser();
        } finally {
            token.value = null;
            user.value = null;

            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    async function ensureLoaded() {
        if (!token.value) {
            return;
        }

        if (user.value) {
            return;
        }

        try {
            const { data } = await getCurrentUser();
            user.value = data.data;
        } catch {
            await logout();
        }
    }

    async function refreshUser() {
        if (!token.value) {
            return null;
        }

        const { data } = await getCurrentUser();
        user.value = data.data;
        localStorage.setItem('user', JSON.stringify(data.data));

        return user.value;
    }

    return {
        user,
        token,
        role,
        isAuthenticated,
        login,
        logout,
        ensureLoaded,
        refreshUser,
    };
});
