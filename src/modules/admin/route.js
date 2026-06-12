import Layout from './layouts/App.vue';
import DashboardPage from './dashboard/Dashboard.vue';

export const adminRoutes = [
    {
        path: '/admin',
        component: Layout,
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
            },
        ],
    },
];