const routes = [
    {
        path: 'roles',
        name: 'role',
        children: [
            {
                path: '',
                name: 'roleList',
                component: () => import('@/modules/admin/roles/list/RoleList.vue'),
                meta: {
                    navKey: 'roles',
                    parentNavKey: 'settings',
                    action: 'view',
                    resource: 'role',
                    layout: 'default',
                    title: 'Roles',
                    breadcrumbs: [
                        { title: 'Role List', routeName: 'roleList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newRole',
                component: () => import('@/modules/admin/roles/entry/NewRole.vue'),
                meta: {
                    navKey: 'roles',
                    parentNavKey: 'settings',
                    action: 'create',
                    resource: 'role',
                    layout: 'default',
                    title: 'Create Role',
                    breadcrumbs: [
                        { title: 'Role List', routeName: 'roleList' },
                        { title: 'New', routeName: 'newRole' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editRole',
                component: () => import('@/modules/admin/roles/entry/EditRole.vue'),
                meta: {
                    navKey: 'roles',
                    parentNavKey: 'settings',
                    action: 'update',
                    resource: 'role',
                    layout: 'default',
                    title: 'Edit Role',
                    breadcrumbs: [
                        { title: 'Role List', routeName: 'roleList' },
                        { title: 'Edit', routeName: 'editRole' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showRole',
                component: () => import('@/modules/admin/roles/detail/ShowRole.vue'),
                meta: {
                    navKey: 'roles',
                    parentNavKey: 'settings',
                    action: 'view',
                    resource: 'role',
                    layout: 'default',
                    title: 'Show Role',
                    breadcrumbs: [
                        { title: 'Role List', routeName: 'roleList' },
                        { title: 'Show Role', routeName: 'showRole' },
                    ],
                },
            },
        ],
    },
];

export default routes;
