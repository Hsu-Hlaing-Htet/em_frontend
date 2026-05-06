import LoginPage from '@/pages/auth/LoginPage.vue';
import SetPassword from '@/pages/system/SetPassword.vue';
import SetPasswordSuccess from '@/pages/system/SetPasswordSuccess.vue';
import InvalidToken from '@/pages/system/InvalidToken.vue';

export const authRoutes = [
    { path: 'login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
    { path: 'set-password/:token', name: 'set-password', component: SetPassword },
    { path: 'set-password/success', name: 'set-password-success', component: SetPasswordSuccess },
    { path: 'invalid-token', name: 'invalid-token', component: InvalidToken },
];
