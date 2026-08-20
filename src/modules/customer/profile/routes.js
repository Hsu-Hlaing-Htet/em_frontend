const routes = [
    {
        path: 'profile',
        alias: 'account',
        name: 'customerProfile',
        component: () => import('./ProfilePage.vue'),
        meta: {
            title: 'Account',
            breadcrumbs: [{ title: 'Account', routeName: 'customerProfile' }],
        },
    },
];

export default routes;
