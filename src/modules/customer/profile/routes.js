const routes = [
    {
        path: 'profile',
        name: 'customerProfile',
        component: () => import('./ProfilePage.vue'),
        meta: {
            title: 'Profile',
            breadcrumbs: [{ title: 'Profile', routeName: 'customerProfile' }],
        },
    },
];

export default routes;
