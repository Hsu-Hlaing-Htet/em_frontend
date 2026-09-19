const routes = [
    {
        path: 'maintenance-categories',
        name: 'maintenanceCategory',
        children: [
            {
                path: '',
                name: 'maintenanceCategoryList',
                component: () => import('@/modules/admin/maintenance-categories/list/MaintenanceCategoryList.vue'),
                meta: {
                    navKey: 'maintenance-categories',
                    parentNavKey: 'settings',
                    action: 'view',
                    resource: 'maintenance_category',
                    layout: 'default',
                    title: 'Maintenance Categories',
                    breadcrumbs: [
                        { title: 'Maintenance Category List', routeName: 'maintenanceCategoryList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newMaintenanceCategory',
                component: () => import('@/modules/admin/maintenance-categories/entry/NewMaintenanceCategory.vue'),
                meta: {
                    navKey: 'maintenance-categories',
                    parentNavKey: 'settings',
                    action: 'create',
                    resource: 'maintenance_category',
                    layout: 'default',
                    title: 'Create Maintenance Category',
                    breadcrumbs: [
                        { title: 'Maintenance Category List', routeName: 'maintenanceCategoryList' },
                        { title: 'New', routeName: 'newMaintenanceCategory' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editMaintenanceCategory',
                component: () => import('@/modules/admin/maintenance-categories/entry/EditMaintenanceCategory.vue'),
                meta: {
                    navKey: 'maintenance-categories',
                    parentNavKey: 'settings',
                    action: 'update',
                    resource: 'maintenance_category',
                    layout: 'default',
                    title: 'Edit Maintenance Category',
                    breadcrumbs: [
                        { title: 'Maintenance Category List', routeName: 'maintenanceCategoryList' },
                        { title: 'Edit', routeName: 'editMaintenanceCategory' },
                    ],
                },
            },
        ],
    },
];

export default routes;
