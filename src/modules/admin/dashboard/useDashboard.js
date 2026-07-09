import { onMounted, ref } from 'vue';
import { service } from './service';

const PROPERTY_COLORS = {
    available: '#7a3149',
    reserved: '#552032',
    occupied: '#9b4d66',
    sold: '#d6b8c1',
    maintenance: '#8b6b74',
};

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
}).format(value ?? 0);

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value ?? 0);

function mapPropertyStats(roomStatus = {}) {
    return Object.entries(roomStatus).map(([key, value]) => ({
        label: key.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        value,
        color: PROPERTY_COLORS[key] || '#7a3149',
    }));
}

function calculateOccupancyRate(roomStatus = {}) {
    const occupied = roomStatus.occupied ?? 0;
    const total = Object.values(roomStatus).reduce((sum, count) => sum + count, 0);

    if (!total) {
        return '0%';
    }

    return `${((occupied / total) * 100).toFixed(1)}%`;
}

function mapStats(totals = {}, revenue = {}, roomStatus = {}) {
    return [
        {
            label: 'Total Rooms',
            value: formatNumber(totals.rooms),
            change: `${formatNumber(totals.contracts)} contracts`,
            trend: 'up',
            icon: 'pi pi-building',
            accent: 'rose',
        },
        {
            label: 'Total Revenue',
            value: formatCurrency(revenue.total_paid),
            change: `${formatCurrency(revenue.outstanding)} outstanding`,
            trend: 'up',
            icon: 'pi pi-dollar',
            accent: 'gold',
        },
        {
            label: 'Residents',
            value: formatNumber(totals.residents),
            change: `${formatNumber(totals.payments)} payments`,
            trend: 'up',
            icon: 'pi pi-users',
            accent: 'blush',
        },
        {
            label: 'Occupancy Rate',
            value: calculateOccupancyRate(roomStatus),
            change: `${formatNumber(totals.maintenance_requests)} maintenance`,
            trend: 'up',
            icon: 'pi pi-chart-line',
            accent: 'wine',
        },
    ];
}

export function useDashboard() {
    const loading = ref(false);
    const stats = ref([]);
    const propertyStats = ref([]);
    const invoiceStatus = ref({});
    const revenue = ref({
        total_paid: 0,
        outstanding: 0,
    });

    const revenueOverview = ref([
        { month: 'Jan', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Apr', amount: 0 },
        { month: 'May', amount: 0 },
        { month: 'Jun', amount: 0 },
    ]);

    const userOverview = ref({
        owners: 0,
        tenants: 0,
        admins: 0,
        customers: 0,
    });

    const recentActivity = ref([]);
    const quickActions = ref([
        { label: 'Manage Rooms', icon: 'pi pi-building', to: '/admin/rooms' },
        { label: 'Manage Residents', icon: 'pi pi-users', to: '/admin/residents' },
        { label: 'Manage Staff', icon: 'pi pi-id-card', to: '/admin/staff' },
        { label: 'Utility Types', icon: 'pi pi-bolt', to: '/admin/utility-types' },
        { label: 'Charge Types', icon: 'pi pi-receipt', to: '/admin/charge-types' },
        { label: 'Payment Methods', icon: 'pi pi-wallet', to: '/admin/payment-methods' },
    ]);

    const applyDashboardData = (payload) => {
        if (!payload) {
            return;
        }

        const totals = payload.totals ?? {};
        const roomStatus = payload.room_status ?? {};
        const nextRevenue = payload.revenue ?? {};

        stats.value = mapStats(totals, nextRevenue, roomStatus);
        propertyStats.value = mapPropertyStats(roomStatus);
        invoiceStatus.value = payload.invoice_status ?? {};
        revenue.value = {
            total_paid: nextRevenue.total_paid ?? 0,
            outstanding: nextRevenue.outstanding ?? 0,
        };

        userOverview.value = {
            owners: 0,
            tenants: totals.residents ?? 0,
            admins: 0,
            customers: totals.residents ?? 0,
        };

        const paidAmount = nextRevenue.total_paid ?? 0;
        revenueOverview.value = revenueOverview.value.map((item, index) => ({
            ...item,
            amount: index === revenueOverview.value.length - 1 ? paidAmount : Math.round(paidAmount * (0.55 + index * 0.08)),
        }));
    };

    const fetchDashboard = async () => {
        loading.value = true;

        try {
            const response = await service.get();
            applyDashboardData(response?.data);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchDashboard();
    });

    return {
        loading,
        stats,
        propertyStats,
        invoiceStatus,
        revenue,
        revenueOverview,
        userOverview,
        recentActivity,
        quickActions,
        fetchDashboard,
    };
}
