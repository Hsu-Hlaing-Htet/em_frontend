import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, logoutUser, getCurrentUser } from './service';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
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

        let redirect_to = '/user';

        if (
            data.user.role === 'super_admin' ||
            data.user.role === 'admin'
        ) {
            redirect_to = '/admin';
        }

        return {
            ...data,
            redirect_to,
        };
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

    return {
        user,
        token,
        role,
        isAuthenticated,
        login,
        logout,
        ensureLoaded,
    };
});
