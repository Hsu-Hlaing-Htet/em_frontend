import Login from './login/LoginPage.vue';
import ForgotPassword from './forgot-password/ForgotPasswordPage.vue';
import ResetPassword from './reset-password/ResetPasswordPage.vue';

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
        path: '/reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: { guestOnly: true },
    },
];
