import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { publicRoutes } from '../modules/public/route.js';
import { authRoutes } from '../modules/auth/route.js';
import { adminRoutes } from '../modules/admin/route.js';
import NotFound from '@/pages/NotFound.vue';
// import { userRoutes } from '../modules/user/route.js';

const routes = [
    ...publicRoutes,
    ...adminRoutes,
    // ...userRoutes,
    ...authRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
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

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next({ name: 'login' });
    }

    if (to.path.startsWith('/admin') && auth.isAuthenticated) {
        const adminRoles = ['super_admin', 'admin'];

        if (!adminRoles.includes(auth.role)) {
            return next({ name: 'login' });
        }
    }

    if (to.meta.role && auth.role !== to.meta.role) {
        if (auth.role === 'admin' || auth.role === 'super_admin') {
            return next({ name: 'dashboard' });
        }

        return next({ name: 'login' });
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
        return next(
            auth.role === 'admin' || auth.role === 'super_admin'
                ? { name: 'dashboard' }
                : { name: 'login' },
        );
    }

    return next();
});

export default router;
