const routes = [
    {
        path: 'dashboard',
        name: 'customerDashboard',
        component: () => import('./Dashboard.vue'),
        meta: {
            title: 'Dashboard',
            breadcrumbs: [{ title: 'Dashboard', routeName: 'customerDashboard' }],
        },
    },
];

export default routes;
