import LoginPage from './entry/LoginPage.vue';

export const authRoutes = [
    { path: 'login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
];
