const routes = [
    {
        path: 'maintenance-requests',
        name: 'maintenanceRequest',
        children: [
            {
                path: '',
                name: 'maintenanceRequestList',
                component: () => import('@/modules/admin/maintenance-requests/list/MaintenanceRequestList.vue'),
                meta: {
                    action: 'view',
                    resource: 'maintenance_request',
                    layout: 'default',
                    title: 'Maintenance Requests',
                    breadcrumbs: [
                        { title: 'Maintenance Request List', routeName: 'maintenanceRequestList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newMaintenanceRequest',
                component: () => import('@/modules/admin/maintenance-requests/entry/NewMaintenanceRequest.vue'),
                meta: {
                    action: 'create',
                    resource: 'maintenance_request',
                    layout: 'default',
                    title: 'Create Maintenance Request',
                    breadcrumbs: [
                        { title: 'Maintenance Request List', routeName: 'maintenanceRequestList' },
                        { title: 'New', routeName: 'newMaintenanceRequest' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editMaintenanceRequest',
                component: () => import('@/modules/admin/maintenance-requests/entry/EditMaintenanceRequest.vue'),
                meta: {
                    action: 'update',
                    resource: 'maintenance_request',
                    layout: 'default',
                    title: 'Edit Maintenance Request',
                    breadcrumbs: [
                        { title: 'Maintenance Request List', routeName: 'maintenanceRequestList' },
                        { title: 'Edit', routeName: 'editMaintenanceRequest' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showMaintenanceRequest',
                component: () => import('@/modules/admin/maintenance-requests/entry/ShowMaintenanceRequest.vue'),
                meta: {
                    action: 'view',
                    resource: 'maintenance_request',
                    layout: 'default',
                    title: 'Show Maintenance Request',
                    breadcrumbs: [
                        { title: 'Maintenance Request List', routeName: 'maintenanceRequestList' },
                        { title: 'Show', routeName: 'showMaintenanceRequest' },
                    ],
                },
            },
        ],
    },
];

export default routes;
