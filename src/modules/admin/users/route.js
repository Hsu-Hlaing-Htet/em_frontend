const routes = [
    {
        path: 'users',
        name: 'user',
        children: [
            {
                path: '',
                name: 'userList',
                component: () => import('@/modules/admin/users/list/UserList.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Users',
                    breadcrumbs: [{ title: 'User List', routeName: 'userList' }],
                },
            },
            {
                path: 'create',
                name: 'newUser',
                component: () => import('@/modules/admin/users/entry/NewUser.vue'),
                meta: {
                    action: 'create',
                    resource: 'user',
                    layout: 'default',
                    title: 'Create User',
                    breadcrumbs: [
                        { title: 'User List', routeName: 'userList' },
                        { title: 'New', routeName: 'newUser' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editUser',
                component: () => import('@/modules/admin/users/entry/EditUser.vue'),
                meta: {
                    action: 'update',
                    resource: 'user',
                    layout: 'default',
                    title: 'Edit User',
                    breadcrumbs: [
                        { title: 'User List', routeName: 'userList' },
                        { title: 'Edit', routeName: 'editUser' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showUser',
                component: () => import('@/modules/admin/users/entry/ShowUser.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Show User',
                    breadcrumbs: [
                        { title: 'User List', routeName: 'userList' },
                        { title: 'Show User', routeName: 'showUser' },
                    ],
                },
            },
        ],
    },
];

export default routes;
