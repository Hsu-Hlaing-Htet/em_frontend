import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { publicRoutes } from '@/routes/publicRoute';
import { adminRoutes } from '@/routes/adminRoute';
import { userRoutes } from '@/routes/userRoute';

const routes = [
    ...publicRoutes,
    ...adminRoutes,
    ...userRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
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
