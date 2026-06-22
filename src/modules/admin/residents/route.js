const routes = [
    {
        path: 'residents',
        name: 'resident',
        children: [
            {
                path: '',
                name: 'residentList',
                component: () => import('@/modules/admin/residents/list/ResidentList.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Residents',
                    breadcrumbs: [
                        { title: 'Resident List', routeName: 'residentList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newResident',
                component: () => import('@/modules/admin/residents/entry/NewResident.vue'),
                meta: {
                    action: 'create',
                    resource: 'user',
                    layout: 'default',
                    title: 'Create Resident',
                    breadcrumbs: [
                        { title: 'Resident List', routeName: 'residentList' },
                        { title: 'New', routeName: 'newResident' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editResident',
                component: () => import('@/modules/admin/residents/entry/EditResident.vue'),
                meta: {
                    action: 'update',
                    resource: 'user',
                    layout: 'default',
                    title: 'Edit Resident',
                    breadcrumbs: [
                        { title: 'Resident List', routeName: 'residentList' },
                        { title: 'Edit', routeName: 'editResident' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showResident',
                component: () => import('@/modules/admin/residents/entry/ShowResident.vue'),
                meta: {
                    action: 'view',
                    resource: 'user',
                    layout: 'default',
                    title: 'Show Resident',
                    breadcrumbs: [
                        { title: 'Resident List', routeName: 'residentList' },
                        { title: 'Show Resident', routeName: 'showResident' },
                    ],
                },
            },
        ],
    },
];

export default routes;
