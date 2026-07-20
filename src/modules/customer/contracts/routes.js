const routes = [
    {
        path: 'contracts',
        name: 'customerContractList',
        component: () => import('./list/ContractList.vue'),
        meta: {
            title: 'My Contracts',
            breadcrumbs: [{ title: 'Contracts', routeName: 'customerContractList' }],
        },
    },
    {
        path: 'contracts/:id',
        name: 'customerShowContract',
        component: () => import('./detail/ShowContract.vue'),
        meta: {
            title: 'Contract Details',
            breadcrumbs: [
                { title: 'Contracts', routeName: 'customerContractList' },
                { title: 'Details', routeName: 'customerShowContract' },
            ],
        },
    },
];

export default routes;
