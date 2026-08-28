import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import ResetPassword from '@/modules/auth/reset-password/ResetPasswordPage.vue';
import { publicRoutes } from '../modules/public/route.js';
import { authRoutes } from '../modules/auth/route.js';
import { adminRoutes } from '../modules/admin/routes.js';
import { customerRoutes } from '../modules/customer/routes.js';
import NotFound from '@/pages/404.vue';
import Forbidden from '@/pages/Forbidden.vue';

const resetPasswordRoute = {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    alias: ['/reset-password/'],
    meta: { public: true },
};

const legacyUserRedirects = [
    { path: '/user', redirect: '/customer/dashboard' },
    { path: '/user/dashboard', redirect: '/customer/dashboard' },
    { path: '/user/my-property', redirect: '/customer/contracts' },
    { path: '/user/my-invoices', redirect: '/customer/invoices' },
    { path: '/user/payment-history', redirect: '/customer/payments' },
    { path: '/user/my-invoices/:id', redirect: (to) => `/customer/invoices/${to.params.id}` },
    { path: '/user/receipts/:id', redirect: (to) => `/customer/receipts/${to.params.id}` },
];

const routes = [
    resetPasswordRoute,
    ...authRoutes,
    ...publicRoutes,
    ...adminRoutes,
    ...customerRoutes,
    ...legacyUserRedirects,
    {
        path: '/forbidden',
        name: 'forbidden',
        component: Forbidden,
        meta: { title: 'Access forbidden' },
    },
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

const adminRoles = ['super_admin', 'admin'];

function forbiddenQuery(from) {
    if (from.startsWith('/admin')) {
        return { from: 'admin' };
    }

    if (from.startsWith('/customer')) {
        return { from: 'customer' };
    }

    return {};
}

router.beforeEach(async (to, from, next) => {
    const isResetPasswordRoute = to.name === 'reset-password'
        || to.path === '/reset-password'
        || to.path === '/reset-password/';

    if (to.meta.public || isResetPasswordRoute) {
        return next();
    }

    const auth = useAuthStore();
    await auth.ensureLoaded();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next({
            name: 'login',
            query: { redirect: to.fullPath },
        });
    }

    const mustChangePassword = Boolean(auth.user?.must_change_password);

    if (
        auth.isAuthenticated
        && mustChangePassword
        && !to.meta.allowPasswordChangeRequired
        && to.name !== 'force-change-password'
    ) {
        return next({ name: 'force-change-password' });
    }

    if (
        auth.isAuthenticated
        && !mustChangePassword
        && to.name === 'force-change-password'
    ) {
        if (adminRoles.includes(auth.role)) {
            return next({ name: 'dashboard' });
        }

        if (auth.role === 'customer') {
            return next({ name: 'customerDashboard' });
        }

        return next({ name: 'home' });
    }

    if (
        auth.isAuthenticated
        && Array.isArray(to.meta.allowedRoles)
        && !to.meta.allowedRoles.includes(auth.role)
    ) {
        return next({
            name: 'forbidden',
            query: forbiddenQuery(to.fullPath),
        });
    }

    if (to.path.startsWith('/customer')) {
        if (auth.isAuthenticated && auth.role !== 'customer') {
            return next({
                name: 'forbidden',
                query: forbiddenQuery(to.fullPath),
            });
        }
    }

    if (to.meta.role && auth.isAuthenticated && auth.role !== to.meta.role) {
        return next({
            name: 'forbidden',
            query: forbiddenQuery(to.fullPath),
        });
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
        if (mustChangePassword) {
            return next({ name: 'force-change-password' });
        }

        if (adminRoles.includes(auth.role)) {
            return next({ name: 'dashboard' });
        }

        if (auth.role === 'customer') {
            return next({ name: 'customerDashboard' });
        }

        return next({ name: 'home' });
    }

    return next();
});

export default router;
