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
                    navKey: 'rooms',
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
                    navKey: 'rooms',
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
                    navKey: 'rooms',
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
                path: ':id/create-contract',
                name: 'createRoomContract',
                component: () => import('@/modules/admin/rooms/entry/CreateRoomContract.vue'),
                meta: {
                    navKey: 'rooms',
                    action: 'create',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Create Contract',
                    breadcrumbs: [
                        { title: 'Room', routeName: 'showRoom' },
                        { title: 'Create Contract', routeName: 'createRoomContract' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showRoom',
                component: () => import('@/modules/admin/rooms/detail/ShowRoom.vue'),
                meta: {
                    navKey: 'rooms',
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
