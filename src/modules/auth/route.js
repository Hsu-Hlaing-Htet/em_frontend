import Login from './login/LoginPage.vue';
import ForgotPassword from './forgot-password/ForgotPasswordPage.vue';
import ForceChangePassword from './change-password/ForceChangePasswordPage.vue';

export const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guestOnly: true },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: { guestOnly: true },
    },
    {
        path: '/change-password',
        name: 'force-change-password',
        component: ForceChangePassword,
        meta: {
            requiresAuth: true,
            allowPasswordChangeRequired: true,
        },
    },
];
