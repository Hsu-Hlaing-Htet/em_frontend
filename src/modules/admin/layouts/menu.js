const menuList = [
  {
      label: 'Overview',
      items: [
          {
              label: 'Dashboard',
              icon: 'pi pi-th-large',
              to: '/admin/dashboard',
          },
      ],
  },

  {
      label: 'Property Management',
      items: [
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
              label: 'Room Images',
              icon: 'pi pi-images',
              to: '/admin/room-images',
          },
      ],
  },

  {
      label: 'Users',
      items: [
          {
              label: 'Users',
              icon: 'pi pi-users',
              to: '/admin/users',
          },
          {
              label: 'Profiles',
              icon: 'pi pi-id-card',
              to: '/admin/profiles',
          },
          {
              label: 'Roles',
              icon: 'pi pi-shield',
              to: '/admin/roles',
          },
      ],
  },
  {
      label: 'Contracts',
      items: [
          {
              label: 'Contracts',
              icon: 'pi pi-file',
              to: '/admin/contracts',
          },
      ],
  },
  
  {
      label: 'Payment Plans',
      items: [
          {
              label: 'Payment Plans',
              icon: 'pi pi-calendar',
              to: '/admin/payment-plans',
          },
      ],
  },
  {
      label: 'Payment Methods',
      items: [
          {
              label: 'Payment Methods',
              icon: 'pi pi-credit-card',
              to: '/admin/payment-methods',
          },
      ],
  },
  {
      label: 'Billing',
      items: [
          {
              label: 'Utilities',
              icon: 'pi pi-bolt',
              to: '/admin/utilities',
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
              label: 'Charge Types',
              icon: 'pi pi-tags',
              to: '/admin/charge-types',
          },
          {
              label: 'Late Fees',
              icon: 'pi pi-clock',
              to: '/admin/late-fees',
          },
      ],
  },

  {
      label: 'Operations',
      items: [
          {
              label: 'Maintenance Requests',
              icon: 'pi pi-wrench',
              to: '/admin/maintenance-requests',
          },
      ],
  },

  {
      label: 'Content Management',
      items: [
          {
              label: 'Categories',
              icon: 'pi pi-folder',
              to: '/admin/categories',
          },
          {
              label: 'Contents',
              icon: 'pi pi-file-edit',
              to: '/admin/contents',
          },
          {
              label: 'Media Library',
              icon: 'pi pi-images',
              to: '/admin/media',
          },
      ],
  },

  {
      label: 'Administration',
      items: [
          {
              label: 'Users',
              icon: 'pi pi-user-edit',
              to: '/admin/users',
          },
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
              label: 'Settings',
              icon: 'pi pi-cog',
              to: '/admin/settings',
          },
      ],
  },

  {
      label: 'Reports',
      items: [
          {
              label: 'Reports',
              icon: 'pi pi-chart-bar',
              to: '/admin/reports',
          },
      ],
  },
];

export default menuList;
