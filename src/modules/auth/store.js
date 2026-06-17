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
            redirect_to = '/admin/dashboard';
        }

        const result = {
            ...data,
            redirect_to,
        };

        // #region agent log
        fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',location:'store.js:login',message:'login result',data:{userRole:data.user?.role,redirect_to,hasToken:!!data.token},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        console.log('LOGIN RESPONSE', result);
        console.log('REDIRECT TO', result.redirect_to);
        console.log('USER ROLE', data.user?.role);

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
