const routes = [
    {
        path: 'profiles',
        name: 'profile',
        children: [
            {
                path: '',
                name: 'profileList',
                component: () => import('@/modules/admin/profiles/list/ProfileList.vue'),
                meta: {
                    action: 'view',
                    resource: 'profile',
                    layout: 'default',
                    title: 'Profiles',
                    breadcrumbs: [{ title: 'Profile List', routeName: 'profileList' }],
                },
            },
            {
                path: 'create',
                name: 'newProfile',
                component: () => import('@/modules/admin/profiles/entry/NewProfile.vue'),
                meta: {
                    action: 'create',
                    resource: 'profile',
                    layout: 'default',
                    title: 'Create Profile',
                    breadcrumbs: [
                        { title: 'Profile List', routeName: 'profileList' },
                        { title: 'New', routeName: 'newProfile' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editProfile',
                component: () => import('@/modules/admin/profiles/entry/EditProfile.vue'),
                meta: {
                    action: 'update',
                    resource: 'profile',
                    layout: 'default',
                    title: 'Edit Profile',
                    breadcrumbs: [
                        { title: 'Profile List', routeName: 'profileList' },
                        { title: 'Edit', routeName: 'editProfile' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showProfile',
                component: () => import('@/modules/admin/profiles/entry/ShowProfile.vue'),
                meta: {
                    action: 'view',
                    resource: 'profile',
                    layout: 'default',
                    title: 'Show Profile',
                    breadcrumbs: [
                        { title: 'Profile List', routeName: 'profileList' },
                        { title: 'Show Profile', routeName: 'showProfile' },
                    ],
                },
            },
        ],
    },
];

export default routes;
