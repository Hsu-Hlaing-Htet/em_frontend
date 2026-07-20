const routes = [
    {
        path: 'profile',
        name: 'adminProfile',
        component: () => import('@/modules/admin/profile/ProfilePage.vue'),
        meta: {
            layout: 'default',
            title: 'Profile',
            breadcrumbs: [
                { title: 'Profile', routeName: 'adminProfile' },
            ],
        },
    },
];

export default routes;
