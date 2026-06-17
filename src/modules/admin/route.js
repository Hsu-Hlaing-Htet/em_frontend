import Layout from './layouts/App.vue';
import DashboardPage from './dashboard/Dashboard.vue';
import roleRoutes from './roles/route';
import userRoutes from './users/route';
import profileRoutes from './profiles/route';

export const adminRoutes = [
    {
        path: '/admin',
        component: Layout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
                meta: { title: 'Dashboard' },
            },
            ...roleRoutes,
            ...userRoutes,
            ...profileRoutes,
        ],
    },
];
