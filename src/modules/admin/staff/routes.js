const routes = [
    {
        path: 'staff',
        name: 'staffMember',
        children: [
            {
                path: '',
                name: 'staffList',
                component: () => import('@/modules/admin/staff/list/StaffList.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Staff',
                    breadcrumbs: [
                        { title: 'Staff List', routeName: 'staffList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newStaff',
                component: () => import('@/modules/admin/staff/entry/NewStaff.vue'),
                meta: {
                    action: 'create',
                    resource: 'user',
                    layout: 'default',
                    title: 'Create Staff',
                    breadcrumbs: [
                        { title: 'Staff List', routeName: 'staffList' },
                        { title: 'New', routeName: 'newStaff' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editStaff',
                component: () => import('@/modules/admin/staff/entry/EditStaff.vue'),
                meta: {
                    action: 'update',
                    resource: 'user',
                    layout: 'default',
                    title: 'Edit Staff',
                    breadcrumbs: [
                        { title: 'Staff List', routeName: 'staffList' },
                        { title: 'Edit', routeName: 'editStaff' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showStaff',
                component: () => import('@/modules/admin/staff/detail/ShowStaff.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Show Staff',
                    breadcrumbs: [
                        { title: 'Staff List', routeName: 'staffList' },
                        { title: 'Show Staff', routeName: 'showStaff' },
                    ],
                },
            },
        ],
    },
];

export default routes;
