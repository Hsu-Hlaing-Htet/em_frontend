const routes = [
    {
        path: 'buildings',
        name: 'building',
        children: [
            {
                path: '',
                name: 'buildingList',
                component: () => import('@/modules/admin/buildings/list/BuildingList.vue'),
                meta: {
                    action: 'view',
                    resource: 'building',
                    layout: 'default',
                    title: 'Buildings',
                    breadcrumbs: [
                        { title: 'Building List', routeName: 'buildingList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newBuilding',
                component: () => import('@/modules/admin/buildings/entry/NewBuilding.vue'),
                meta: {
                    action: 'create',
                    resource: 'building',
                    layout: 'default',
                    title: 'Create Building',
                    breadcrumbs: [
                        { title: 'Building List', routeName: 'buildingList' },
                        { title: 'New', routeName: 'newBuilding' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editBuilding',
                component: () => import('@/modules/admin/buildings/entry/EditBuilding.vue'),
                meta: {
                    action: 'update',
                    resource: 'building',
                    layout: 'default',
                    title: 'Edit Building',
                    breadcrumbs: [
                        { title: 'Building List', routeName: 'buildingList' },
                        { title: 'Edit', routeName: 'editBuilding' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showBuilding',
                component: () => import('@/modules/admin/buildings/entry/ShowBuilding.vue'),
                meta: {
                    action: 'view',
                    resource: 'building',
                    layout: 'default',
                    title: 'Show Building',
                    breadcrumbs: [
                        { title: 'Building List', routeName: 'buildingList' },
                        { title: 'Show Building', routeName: 'showBuilding' },
                    ],
                },
            },
        ],
    },
];

export default routes;
