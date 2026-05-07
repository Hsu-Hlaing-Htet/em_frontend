import { computed, reactive } from 'vue';
import { getCurrentUser, loginUser, logoutUser } from '@/modules/auth/service';

const state = reactive({ user: null, initialized: false, loading: false });

async function fetchUser() {
    try {
        const { data } = await getCurrentUser();
        state.user = data.user;
    } catch {
        state.user = null;
    } finally {
        state.initialized = true;
    }
}

export function useAuthStore() {
    async function ensureLoaded() {
        if (!state.initialized && !state.loading) {
            state.loading = true;
            await fetchUser();
            state.loading = false;
        }
    }

    async function login(payload) {
        const { data } = await loginUser(payload);
        state.user = data.user;
        state.initialized = true;
        return data;
    }

    async function logout() {
        await logoutUser();
        state.user = null;
    }

    return {
        state,
        ensureLoaded,
        fetchUser,
        login,
        logout,
        isAuthenticated: computed(() => Boolean(state.user)),
        role: computed(() => state.user?.role ?? null),
    };
}
