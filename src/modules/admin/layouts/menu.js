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
        label: 'Accounts',
        icon: 'pi pi-users',
        items: [
            {
                label: 'Residents',
                icon: 'pi pi-users',
                to: '/admin/users',
            },
            {
                label: 'Admins',
                icon: 'pi pi-user-plus',
                to: '/admin/staffs',
            },
        ],
    },

    {
        label: 'Contracts',
        icon: 'pi pi-file',
        to: '/admin/contracts',
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
                label: 'Invoices',
                icon: 'pi pi-receipt',
                to: '/admin/invoices',
            },

            {
                label: 'Maintenance Requests',
                icon: 'pi pi-wrench',
                to: '/admin/maintenance-requests',
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
                label: 'Payment Methods',
                icon: 'pi pi-credit-card',
                to: '/admin/payment-methods',
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
                label: 'Utility Types',
                icon: 'pi pi-list',
                to: '/admin/utility-types',
            },
            {
                label: 'Utility Rates',
                icon: 'pi pi-dollar',
                to: '/admin/utility-rates',
            },
        ],
    },
];

export default menuList;