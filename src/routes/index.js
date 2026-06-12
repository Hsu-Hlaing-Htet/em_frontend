import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { publicRoutes } from '../modules/public/route.js';
import { authRoutes } from '../modules/auth/route.js';
import { adminRoutes } from '../modules/admin/route.js';
// import { userRoutes } from '../modules/user/route.js';

const routes = [
    ...publicRoutes,
    ...adminRoutes,
    // ...userRoutes,
    ...authRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition;
    }

    if (to.hash) {
        return new Promise((resolve) => {
            window.setTimeout(() => {
                resolve({ el: to.hash, top: 96, behavior: 'smooth' });
            }, 340);
        });
    }

    return { top: 0, behavior: 'smooth' };
}

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior,
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    await auth.ensureLoaded();

    if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
        return next({ name: 'login' });
    }

    if (to.meta.requiresAuth && auth.role.value !== to.meta.role) {
        if (auth.role.value === 'admin') {
            return next({ name: 'admin-dashboard' });
        }

        if (auth.role.value === 'owner') {
            return next({ name: 'user-dashboard' });
        }

        return next({ name: 'login' });
    }

    if (to.meta.guestOnly && auth.isAuthenticated.value) {
        return next(auth.role.value === 'admin' ? { name: 'admin-dashboard' } : { name: 'user-dashboard' });
    }

    return next();
});

export default router;
