const routes = [
    {
        path: 'notifications',
        name: 'customerNotificationList',
        component: () => import('./list/NotificationList.vue'),
        meta: {
            title: 'Notifications',
            breadcrumbs: [{ title: 'Notifications', routeName: 'customerNotificationList' }],
        },
    },
];

export default routes;
