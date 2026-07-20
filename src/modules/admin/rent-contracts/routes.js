const rentContractRoutes = [
    {
        path: 'rent-contracts',
        name: 'rentContract',
        children: [
            {
                path: 'drafts',
                name: 'rentContractDraftList',
                component: () => import('@/modules/admin/rent-contracts/draft/RentDraftList.vue'),
                meta: {
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Drafts',
                    breadcrumbs: [
                        { title: 'Rent Drafts', routeName: 'rentContractDraftList' },
                    ],
                },
            },
            {
                path: 'drafts/create',
                name: 'newRentContractDraft',
                component: () => import('@/modules/admin/rent-contracts/draft/NewRentDraft.vue'),
                meta: {
                    action: 'create',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Create Rent Draft',
                    breadcrumbs: [
                        { title: 'Rent Drafts', routeName: 'rentContractDraftList' },
                        { title: 'Create', routeName: 'newRentContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/edit',
                name: 'editRentContractDraft',
                component: () => import('@/modules/admin/rent-contracts/draft/EditRentDraft.vue'),
                meta: {
                    action: 'update',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Edit Rent Draft',
                    breadcrumbs: [
                        { title: 'Rent Drafts', routeName: 'rentContractDraftList' },
                        { title: 'Edit', routeName: 'editRentContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/contract',
                name: 'rentContractDraftPdf',
                component: () => import('@/modules/admin/rent-contracts/draft/ContractPdf.vue'),
                meta: {
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Contract PDF',
                    breadcrumbs: [
                        { title: 'Rent Drafts', routeName: 'rentContractDraftList' },
                        { title: 'Detail', routeName: 'showRentContractDraft' },
                        { title: 'Contract', routeName: 'rentContractDraftPdf' },
                    ],
                },
            },
            {
                path: 'drafts/:id',
                name: 'showRentContractDraft',
                component: () => import('@/modules/admin/rent-contracts/draft/ShowRentDraft.vue'),
                meta: {
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Rent Draft Detail',
                    breadcrumbs: [
                        { title: 'Rent Drafts', routeName: 'rentContractDraftList' },
                        { title: 'Detail', routeName: 'showRentContractDraft' },
                    ],
                },
            },
            {
                path: 'active',
                name: 'activeRentList',
                component: () => import('@/modules/admin/rent-contracts/active/ActiveRentList.vue'),
                meta: {
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Active Rents',
                    breadcrumbs: [
                        { title: 'Active Rents', routeName: 'activeRentList' },
                    ],
                },
            },
            {
                path: 'active/:id',
                name: 'showActiveRent',
                component: () => import('@/modules/admin/rent-contracts/active/ShowActiveRent.vue'),
                meta: {
                    action: 'view',
                    resource: 'rent_contract',
                    layout: 'default',
                    title: 'Active Rent Detail',
                    breadcrumbs: [
                        { title: 'Active Rents', routeName: 'activeRentList' },
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
