const routes = [
    {
        path: 'rooms',
        name: 'room',
        children: [
            {
                path: '',
                name: 'roomList',
                component: () => import('@/modules/admin/rooms/list/RoomList.vue'),
                meta: {
                    action: 'view',
                    resource: 'room',
                    layout: 'default',
                    title: 'Rooms',
                    breadcrumbs: [
                        { title: 'Room List', routeName: 'roomList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newRoom',
                component: () => import('@/modules/admin/rooms/entry/NewRoom.vue'),
                meta: {
                    action: 'create',
                    resource: 'room',
                    layout: 'default',
                    title: 'Create Room',
                    breadcrumbs: [
                        { title: 'Room List', routeName: 'roomList' },
                        { title: 'New', routeName: 'newRoom' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editRoom',
                component: () => import('@/modules/admin/rooms/entry/EditRoom.vue'),
                meta: {
                    action: 'update',
                    resource: 'room',
                    layout: 'default',
                    title: 'Edit Room',
                    breadcrumbs: [
                        { title: 'Room List', routeName: 'roomList' },
                        { title: 'Edit', routeName: 'editRoom' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showRoom',
                component: () => import('@/modules/admin/rooms/detail/ShowRoom.vue'),
                meta: {
                    action: 'view',
                    resource: 'room',
                    layout: 'default',
                    title: 'Show Room',
                    breadcrumbs: [
                        { title: 'Room List', routeName: 'roomList' },
                        { title: 'Show Room', routeName: 'showRoom' },
                    ],
                },
            },
        ],
    },
];

export default routes;
