import { ref } from 'vue';

export function useDashboard() {
    const stats = ref([
        {
            label: 'Total Properties',
            value: '248',
            change: '+12%',
            trend: 'up',
            icon: 'pi pi-building',
            accent: 'rose',
        },
        {
            label: 'Monthly Revenue',
            value: '$1.24M',
            change: '+8.4%',
            trend: 'up',
            icon: 'pi pi-dollar',
            accent: 'gold',
        },
        {
            label: 'Active Users',
            value: '1,842',
            change: '+5.2%',
            trend: 'up',
            icon: 'pi pi-users',
            accent: 'blush',
        },
        {
            label: 'Occupancy Rate',
            value: '94.6%',
            change: '+2.1%',
            trend: 'up',
            icon: 'pi pi-chart-line',
            accent: 'wine',
        },
    ]);

    const propertyStats = ref([
        { label: 'Available', value: 42, color: '#7a3149' },
        { label: 'Reserved', value: 28, color: '#552032' },
        { label: 'Occupied', value: 156, color: '#9b4d66' },
        { label: 'Sold', value: 22, color: '#d6b8c1' },
    ]);

    const revenueOverview = ref([
        { month: 'Jan', amount: 62 },
        { month: 'Feb', amount: 74 },
        { month: 'Mar', amount: 68 },
        { month: 'Apr', amount: 82 },
        { month: 'May', amount: 91 },
        { month: 'Jun', amount: 88 },
    ]);

    const userOverview = ref({
        owners: 186,
        tenants: 412,
        admins: 24,
        customers: 1220,
    });

    const recentActivity = ref([
        {
            id: 1,
            title: 'New lease contract signed',
            detail: 'Rosewood Sky Condo 8A — Kyaw Win',
            time: '12 min ago',
            icon: 'pi pi-file',
        },
        {
            id: 2,
            title: 'Payment received',
            detail: 'INV-2026-0042 — $14,200',
            time: '38 min ago',
            icon: 'pi pi-wallet',
        },
        {
            id: 3,
            title: 'Maintenance request opened',
            detail: 'Lake Tower 4C — HVAC inspection',
            time: '1 hr ago',
            icon: 'pi pi-wrench',
        },
        {
            id: 4,
            title: 'Property listed',
            detail: 'Metro Heights 12B — For Rent',
            time: '3 hrs ago',
            icon: 'pi pi-building',
        },
        {
            id: 5,
            title: 'Invoice issued',
            detail: 'CNT-L-2026-0018 — Monthly rent',
            time: '5 hrs ago',
            icon: 'pi pi-receipt',
        },
    ]);

    const quickActions = ref([
        { label: 'Add Property', icon: 'pi pi-plus', to: '/admin/properties' },
        { label: 'New Contract', icon: 'pi pi-file-edit', to: '/admin/contracts' },
        { label: 'Generate Invoice', icon: 'pi pi-receipt', to: '/admin/invoices' },
        { label: 'Record Payment', icon: 'pi pi-wallet', to: '/admin/payments' },
        { label: 'View Reports', icon: 'pi pi-chart-bar', to: '/admin/reports' },
        { label: 'Manage Users', icon: 'pi pi-users', to: '/admin/users' },
    ]);

    return {
        stats,
        propertyStats,
        revenueOverview,
        userOverview,
        recentActivity,
        quickActions,
    };
}
