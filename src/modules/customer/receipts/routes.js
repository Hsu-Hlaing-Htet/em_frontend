const routes = [
    {
        path: 'receipts',
        name: 'customerReceiptList',
        component: () => import('./list/ReceiptList.vue'),
        meta: {
            title: 'My Receipts',
            breadcrumbs: [{ title: 'Receipts', routeName: 'customerReceiptList' }],
        },
    },
    {
        path: 'receipts/:id',
        name: 'customerShowReceipt',
        component: () => import('./detail/ShowReceipt.vue'),
        meta: {
            title: 'Receipt Details',
            breadcrumbs: [
                { title: 'Receipts', routeName: 'customerReceiptList' },
                { title: 'Details', routeName: 'customerShowReceipt' },
            ],
        },
    },
];

export default routes;
