const routes = [
    {
        path: 'maintenance-requests',
        name: 'customerMaintenanceRequestList',
        component: () => import('./list/MaintenanceRequestList.vue'),
        meta: {
            title: 'Maintenance Requests',
            breadcrumbs: [{ title: 'Maintenance', routeName: 'customerMaintenanceRequestList' }],
        },
    },
    {
        path: 'maintenance-requests/new',
        name: 'customerNewMaintenanceRequest',
        component: () => import('./entry/NewMaintenanceRequest.vue'),
        meta: {
            title: 'New Maintenance Request',
            breadcrumbs: [
                { title: 'Maintenance', routeName: 'customerMaintenanceRequestList' },
                { title: 'New Request', routeName: 'customerNewMaintenanceRequest' },
            ],
        },
    },
    {
        path: 'maintenance-requests/:id',
        name: 'customerShowMaintenanceRequest',
        component: () => import('./detail/ShowMaintenanceRequest.vue'),
        meta: {
            title: 'Maintenance Request Details',
            breadcrumbs: [
                { title: 'Maintenance', routeName: 'customerMaintenanceRequestList' },
                { title: 'Details', routeName: 'customerShowMaintenanceRequest' },
            ],
        },
    },
];

export default routes;
