import PlaceholdersPage from '@/pages/admin/PlaceholdersPage.vue';

export const adminPlaceholdersRoute = {
    path: ':section(owners|tenants|contracts|invoices|meter-readings|reports)',
    name: 'admin-section',
    component: PlaceholdersPage,
    props: true,
};
