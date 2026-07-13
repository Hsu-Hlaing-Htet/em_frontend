const menuList = [
    {
        label: 'Dashboard',
        icon: 'pi pi-th-large',
        to: '/admin/dashboard',
    },

    {
        label: 'Buildings',
        icon: 'pi pi-building',
        to: '/admin/buildings',
    },

    {
        label: 'Rooms',
        icon: 'pi pi-home',
        to: '/admin/rooms',
    },

    {
        label: 'Users',
        icon: 'pi pi-users',
        items: [
            {
                label: 'Residents',
                icon: 'pi pi-users',
                to: '/admin/residents',
            },
            {
                label: 'Staffs',
                icon: 'pi pi-user-plus',
                to: '/admin/staff',
            },
        ],
    },

    {
        label: 'Contracts',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Sale Drafts',
                icon: 'pi pi-file-edit',
                to: '/admin/sale-contracts/drafts',
            },
            {
                label: 'Active Sales',
                icon: 'pi pi-check-circle',
                to: '/admin/sale-contracts/active',
            },
            {
                label: 'Rent',
                icon: 'pi pi-home',
                to: '/admin/rent-contracts',
            },
        ],
    },

    {
        label: 'Utilities',
        icon: 'pi pi-bolt',
        to: '/admin/utilities',
    },

    {
        label: 'Invoices',
        icon: 'pi pi-receipt',
        to: '/admin/invoices',
    },

    {
        label: 'Payments',
        icon: 'pi pi-wallet',
        to: '/admin/payments',
    },
    {
        label: 'Receipts',
        icon: 'pi pi-ticket',
        to: '/admin/receipts',
    },
    {
        label: 'Maintenance Requests',
        icon: 'pi pi-wrench',
        to: '/admin/maintenance-requests',
    },
    {
        label: 'Approvals',
        icon: 'pi pi-verified',
        items: [
            {
                label: 'Sale Contracts',
                icon: 'pi pi-file-check',
                to: '/admin/approvals/sale-contracts',
            },
        ],
    },

    {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Roles',
                icon: 'pi pi-shield',
                to: '/admin/roles',
            },
            {
                label: 'Utility Types',
                icon: 'pi pi-list',
                to: '/admin/utility-types',
            },
            {
                label: 'Utility Rates',
                icon: 'pi pi-dollar',
                to: '/admin/utility-rates',
            },
            {
                label: 'Charge Types',
                icon: 'pi pi-tags',
                to: '/admin/charge-types',
            },
            {
                label: 'Late Fees',
                icon: 'pi pi-clock',
                to: '/admin/late-fees',
            },
            {
                label: 'Payment Methods',
                icon: 'pi pi-credit-card',
                to: '/admin/payment-methods',
            },
        ],
    },
];

export default menuList;
