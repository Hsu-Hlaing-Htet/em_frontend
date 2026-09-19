const rentContractRoutes = [
    {
        path: 'rent-contracts',
        name: 'rentContract',
        children: [
            {
                path: 'drafts',
                name: 'rentContractDraftList',
                redirect: { name: 'activeRentList' },
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contracts',
                },
            },
            {
                path: 'drafts/create',
                name: 'newRentContractDraft',
                redirect: { name: 'roomList' },
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'create',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Create Contract',
                },
            },
            {
                path: 'drafts/:id/edit',
                name: 'editRentContractDraft',
                component: () => import('@/modules/admin/rent-contracts/draft/EditRentDraft.vue'),
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'update',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Edit Rent Contract',
                    breadcrumbs: [
                        { title: 'Rent Contracts', routeName: 'activeRentList' },
                        { title: 'Edit', routeName: 'editRentContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/contract',
                name: 'rentContractDraftPdf',
                redirect: (to) => ({ name: 'showRentContractDraft', params: to.params }),
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contract PDF',
                    breadcrumbs: [
                        { title: 'Rent Contracts', routeName: 'activeRentList' },
                        { title: 'Detail', routeName: 'showRentContractDraft' },
                        { title: 'Contract', routeName: 'rentContractDraftPdf' },
                    ],
                },
            },
            {
                path: 'drafts/:id',
                name: 'showRentContractDraft',
                component: () => import('@/modules/admin/rent-contracts/draft/ContractPdf.vue'),
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contract',
                    breadcrumbs: [
                        { title: 'Rent Contracts', routeName: 'activeRentList' },
                        { title: 'Detail', routeName: 'showRentContractDraft' },
                    ],
                },
            },
            {
                path: 'active',
                name: 'activeRentList',
                component: () => import('@/modules/admin/rent-contracts/active/ActiveRentList.vue'),
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contracts',
                    breadcrumbs: [
                        { title: 'Rent Contracts', routeName: 'activeRentList' },
                    ],
                },
            },
            {
                path: 'active/:id',
                name: 'showActiveRent',
                component: () => import('@/modules/admin/rent-contracts/active/ShowActiveRent.vue'),
                meta: {
                    navKey: 'rent-contracts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contract Detail',
                    breadcrumbs: [
                        { title: 'Rent Contracts', routeName: 'activeRentList' },
                        { title: 'Detail', routeName: 'showActiveRent' },
                    ],
                },
            },
        ],
    },
    {
        path: 'approvals/rent-contracts',
        name: 'rentContractApproval',
        children: [
            {
                path: '',
                name: 'rentContractApprovalList',
                component: () => import('@/modules/admin/rent-contracts/approval/RentContractApprovalList.vue'),
                meta: {
                    navKey: 'approval-rent-contracts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'rent_contract_approval',
                    layout: 'default',
                    title: 'Rent Contract Approvals',
                    breadcrumbs: [
                        { title: 'Rent Contract Approvals', routeName: 'rentContractApprovalList' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showRentContractApproval',
                component: () => import('@/modules/admin/rent-contracts/approval/ShowRentContractApproval.vue'),
                meta: {
                    navKey: 'approval-rent-contracts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'rent_contract_approval',
                    layout: 'default',
                    title: 'Rent Contract Approval Detail',
                    breadcrumbs: [
                        { title: 'Rent Contract Approvals', routeName: 'rentContractApprovalList' },
                        { title: 'Detail', routeName: 'showRentContractApproval' },
                    ],
                },
            },
        ],
    },
];

export default rentContractRoutes;
