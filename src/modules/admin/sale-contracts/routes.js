const saleContractRoutes = [
    {
        path: 'sale-contracts',
        name: 'saleContract',
        children: [
            {
                path: 'drafts',
                name: 'saleContractDraftList',
                redirect: { name: 'activeSaleList' },
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contracts',
                },
            },
            {
                path: 'drafts/create',
                name: 'newSaleContractDraft',
                redirect: { name: 'roomList' },
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'create',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Create Contract',
                },
            },
            {
                path: 'drafts/:id/edit',
                name: 'editSaleContractDraft',
                component: () => import('@/modules/admin/sale-contracts/draft/EditSaleDraft.vue'),
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'update',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Edit Sale Contract',
                    breadcrumbs: [
                        { title: 'Sale Contracts', routeName: 'activeSaleList' },
                        { title: 'Edit', routeName: 'editSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/contract',
                name: 'saleContractDraftPdf',
                redirect: (to) => ({ name: 'showSaleContractDraft', params: to.params }),
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contract PDF',
                    breadcrumbs: [
                        { title: 'Sale Contracts', routeName: 'activeSaleList' },
                        { title: 'Detail', routeName: 'showSaleContractDraft' },
                        { title: 'Contract', routeName: 'saleContractDraftPdf' },
                    ],
                },
            },
            {
                path: 'drafts/:id',
                name: 'showSaleContractDraft',
                component: () => import('@/modules/admin/sale-contracts/draft/ContractPdf.vue'),
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contract',
                    breadcrumbs: [
                        { title: 'Sale Contracts', routeName: 'activeSaleList' },
                        { title: 'Detail', routeName: 'showSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'active',
                name: 'activeSaleList',
                component: () => import('@/modules/admin/sale-contracts/active/ActiveSaleList.vue'),
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contracts',
                    breadcrumbs: [
                        { title: 'Sale Contracts', routeName: 'activeSaleList' },
                    ],
                },
            },
            {
                path: 'active/:id',
                name: 'showActiveSale',
                component: () => import('@/modules/admin/sale-contracts/active/ShowActiveSale.vue'),
                meta: {
                    navKey: 'sale-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contract Detail',
                    breadcrumbs: [
                        { title: 'Sale Contracts', routeName: 'activeSaleList' },
                        { title: 'Detail', routeName: 'showActiveSale' },
                    ],
                },
            },
        ],
    },
    {
        path: 'approvals/sale-contracts',
        name: 'saleContractApproval',
        children: [
            {
                path: '',
                name: 'saleContractApprovalList',
                component: () => import('@/modules/admin/sale-contracts/approval/SaleContractApprovalList.vue'),
                meta: {
                    navKey: 'approval-sale-contracts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'sale_contract_approval',
                    layout: 'default',
                    title: 'Sale Contract Approvals',
                    breadcrumbs: [
                        { title: 'Sale Contract Approvals', routeName: 'saleContractApprovalList' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showSaleContractApproval',
                component: () => import('@/modules/admin/sale-contracts/approval/ShowSaleContractApproval.vue'),
                meta: {
                    navKey: 'approval-sale-contracts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'sale_contract_approval',
                    layout: 'default',
                    title: 'Sale Contract Approval Detail',
                    breadcrumbs: [
                        { title: 'Sale Contract Approvals', routeName: 'saleContractApprovalList' },
                        { title: 'Detail', routeName: 'showSaleContractApproval' },
                    ],
                },
            },
        ],
    },
];

export default saleContractRoutes;
