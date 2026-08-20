import Login from './login/LoginPage.vue';
import ForgotPassword from './forgot-password/ForgotPasswordPage.vue';

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
];
