import {
    computed,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    watch,
} from 'vue';
import { DASHBOARD_SECTION_LIST } from './config/sections';
import { SORT_OPTIONS, STATUS_FILTER_OPTIONS } from './config/listOptions';
import { SEARCHABLE_CONTROL_KEYS, useDashboardControls } from './composables/useDashboardControls';
import { dashboardService } from './service';
import { usePropertyInteractions } from './usePropertyInteractions';
import {
    formatCurrency,
    formatDate,
    formatDetailRecord,
    formatNumber,
} from './utils/formatters';

export function useDashboard() {
    const loading = ref(true);
    const error = ref(null);
    const lastUpdated = ref(null);
    const autoRefresh = ref(false);
    const refreshTimer = ref(null);

    const revenueRange = ref(6);
    const hoveredBar = ref(null);
    const selectedStat = ref(null);
    const propertyFilter = ref(null);
    const invoiceFilter = ref(null);
    const activityFilter = ref('all');
    const quickActionQuery = ref('');
    const globalSearch = ref('');
    const selectedRoleId = ref(null);
    const settingsSaved = ref(false);

    const stats = ref([]);
    const propertyStats = ref([]);
    const invoiceStats = ref([]);
    const revenueOverview = ref([]);
    const revenueSummary = ref({});
    const revenueCollections = ref({ collection_rate: 0, points: [] });
    const receivableAging = ref([]);
    const upcomingContracts = ref([]);
    const recentActivity = ref([]);
    const systemAlerts = ref({
        expired_contracts: 0,
        unresolved_maintenance: 0,
    });
    const quickActions = ref([]);

    const properties = ref([]);
    const customers = ref([]);
    const agents = ref([]);
    const tenants = ref([]);
    const inquiries = ref([]);
    const contracts = ref([]);
    const invoices = ref([]);
    const payments = ref([]);
    const bookings = ref([]);
    const maintenance = ref([]);
    const notifications = ref([]);
    const reports = ref([]);
    const reportStats = ref([]);
    const roles = ref([]);
    const permissionModules = ref([]);
    const settings = ref({});

    const modalOpen = ref(false);
    const modalTitle = ref('Details');
    const modalItem = ref(null);

    const dataRefs = {
        properties,
        customers,
        agents,
        tenants,
        inquiries,
        contracts,
        invoices,
        payments,
        bookings,
        maintenance,
        notifications,
        activity: recentActivity,
        reports,
        roles,
    };

    const controls = useDashboardControls(dataRefs);
    const propertyInteractions = usePropertyInteractions(properties);

    const visibleRevenueOverview = computed(() => revenueOverview.value.slice(-revenueRange.value));

    const maxRevenue = computed(() => {
        const amounts = visibleRevenueOverview.value.map((item) => item.amount);
        return Math.max(...amounts, 1);
    });

    const filteredPropertyStats = computed(() => {
        const items = (propertyStats.value ?? []).filter(Boolean);

        if (!propertyFilter.value) {
            return items;
        }

        return items.filter((item) => item?.key === propertyFilter.value);
    });

    const maxProperty = computed(() => {
        const values = filteredPropertyStats.value.map((item) => item?.value ?? 0);
        return Math.max(...values, 1);
    });

    const filteredInvoiceStats = computed(() => {
        const items = (invoiceStats.value ?? []).filter(Boolean);

        if (!invoiceFilter.value) {
            return items;
        }

        return items.filter((item) => item?.key === invoiceFilter.value);
    });

    const invoiceTotal = computed(() => invoiceStats.value.reduce((sum, item) => sum + (item?.value ?? 0), 0));

    const filteredActivity = computed(() => {
        const items = (recentActivity.value ?? []).filter(Boolean);

        if (activityFilter.value === 'all') {
            return items.slice(0, 4);
        }

        return items.filter((item) => item?.tag === activityFilter.value).slice(0, 4);
    });

    const filteredQuickActions = computed(() => {
        const query = quickActionQuery.value.trim().toLowerCase();
        const actions = (quickActions.value ?? []).filter(Boolean);

        if (!query) {
            return actions;
        }

        return actions.filter((action) => action?.label?.toLowerCase().includes(query));
    });

    const unreadNotificationCount = computed(() => (
        notifications.value.filter((item) => item.status === 'unread').length
    ));

    const lastUpdatedLabel = computed(() => {
        if (!lastUpdated.value) {
            return 'Not synced yet';
        }

        return lastUpdated.value.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    });

    const revenueSummaryCards = computed(() => [
        { label: 'Collected this month', value: formatCurrency(revenueSummary.value.collected_this_month) },
        { label: 'Total paid', value: formatCurrency(revenueSummary.value.total_paid) },
        { label: 'Outstanding', value: formatCurrency(revenueSummary.value.outstanding) },
        { label: 'Growth', value: `+${revenueSummary.value.growth_percent ?? 0}%` },
    ]);

    const sections = DASHBOARD_SECTION_LIST;

    const selectedRole = computed(() => (
        roles.value.find((role) => role.id === selectedRoleId.value) ?? roles.value[0] ?? null
    ));

    function barHeight(amount) {
        return `${(amount / maxRevenue.value) * 100}%`;
    }

    function propertyBarWidth(value) {
        return `${(value / maxProperty.value) * 100}%`;
    }

    function invoiceBarWidth(value) {
        return `${(value / Math.max(invoiceTotal.value, 1)) * 100}%`;
    }

    function setRevenueRange(months) {
        revenueRange.value = months;
        hoveredBar.value = null;
    }

    function selectStat(stat) {
        selectedStat.value = selectedStat.value?.key === stat.key ? null : stat;
    }

    function clearSelectedStat() {
        selectedStat.value = null;
    }

    function togglePropertyFilter(key) {
        propertyFilter.value = propertyFilter.value === key ? null : key;
    }

    function clearPropertyFilter() {
        propertyFilter.value = null;
    }

    function toggleInvoiceFilter(key) {
        invoiceFilter.value = invoiceFilter.value === key ? null : key;
    }

    function clearInvoiceFilter() {
        invoiceFilter.value = null;
    }

    function setActivityFilter(filter) {
        activityFilter.value = filter;
    }

    function hoverBar(item) {
        hoveredBar.value = item;
    }

    function clearHoveredBar() {
        hoveredBar.value = null;
    }

    function openDetail(title, item) {
        modalTitle.value = title;
        modalItem.value = formatDetailRecord(item);
        modalOpen.value = true;
    }

    function viewProperty(property) {
        propertyInteractions.trackRecentlyViewed(property);
        openDetail(property.name, property);
    }

    function handleFavorite(property) {
        propertyInteractions.toggleFavorite(property);
    }

    function handleCompare(property) {
        propertyInteractions.toggleCompare(property);
    }

    function closeModal() {
        modalOpen.value = false;
        modalItem.value = null;
    }

    function selectRole(roleId) {
        selectedRoleId.value = roleId;
    }

    async function saveSettings() {
        settingsSaved.value = false;

        try {
            const result = await dashboardService.updateSettings(settings.value);
            settings.value = result.settings ?? settings.value;
            settingsSaved.value = true;
        } catch (loadError) {
            error.value = loadError?.message ?? 'Unable to save settings.';
        }
    }

    async function generateReport(report) {
        openDetail(report.name, {
            ...report,
            status: 'generating',
            message: 'Report generation started. You will be notified when ready.',
        });

        try {
            await dashboardService.generateReport(report.id);
            reports.value = reports.value.map((item) => (
                item.id === report.id ? { ...item, status: 'generating' } : item
            ));
        } catch (loadError) {
            error.value = loadError?.message ?? 'Unable to generate report.';
        }
    }

    function markNotificationRead(notification) {
        notifications.value = notifications.value.map((item) => (
            item.id === notification.id ? { ...item, status: 'read' } : item
        ));
    }

    function applyPayload(payload) {
        stats.value = payload.kpi_stats ?? [];
        propertyStats.value = payload.property_stats ?? [];
        invoiceStats.value = payload.invoice_stats ?? [];
        revenueOverview.value = payload.revenue_chart ?? [];
        revenueSummary.value = payload.revenue_summary ?? {};
        revenueCollections.value = payload.revenue_collections ?? { collection_rate: 0, points: [] };
        receivableAging.value = payload.receivable_aging ?? [];
        upcomingContracts.value = payload.upcoming_contracts ?? [];
        recentActivity.value = payload.activity_timeline ?? [];
        systemAlerts.value = payload.system_alerts ?? {
            expired_contracts: 0,
            unresolved_maintenance: 0,
        };
        quickActions.value = payload.quick_actions ?? [];
        properties.value = payload.properties ?? [];
        customers.value = payload.customers ?? [];
        agents.value = payload.agents ?? [];
        tenants.value = payload.tenants ?? [];
        inquiries.value = payload.inquiries ?? [];
        contracts.value = payload.contracts ?? [];
        invoices.value = payload.invoices ?? [];
        payments.value = payload.payments ?? [];
        bookings.value = payload.bookings ?? [];
        maintenance.value = payload.maintenance_requests ?? [];
        notifications.value = payload.notifications ?? [];
        reports.value = payload.reports ?? [];
        reportStats.value = payload.report_stats ?? [];
        roles.value = payload.roles ?? [];
        permissionModules.value = payload.permission_modules ?? [];
        settings.value = payload.settings ?? {};
        selectedRoleId.value = roles.value[0]?.id ?? null;
    }

    function stopAutoRefresh() {
        if (refreshTimer.value) {
            window.clearInterval(refreshTimer.value);
            refreshTimer.value = null;
        }
    }

    function startAutoRefresh() {
        stopAutoRefresh();
        refreshTimer.value = window.setInterval(() => {
            loadDashboard(true);
        }, (settings.value.refresh_interval_seconds ?? 60) * 1000);
    }

    function toggleAutoRefresh() {
        autoRefresh.value = !autoRefresh.value;
        settings.value.auto_refresh = autoRefresh.value;
    }

    async function loadDashboard(silent = false) {
        if (!silent) {
            loading.value = true;
        }

        error.value = null;

        try {
            const payload = await dashboardService.fetchAll();
            applyPayload(payload);
            lastUpdated.value = new Date();
        } catch (loadError) {
            error.value = loadError?.message ?? 'Unable to load dashboard data.';
        } finally {
            loading.value = false;
        }
    }

    async function refresh() {
        await loadDashboard(false);
    }

    watch(autoRefresh, (enabled) => {
        if (enabled) {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }

        if (settings.value.auto_refresh !== enabled) {
            settings.value.auto_refresh = enabled;
        }
    });

    watch(
        () => settings.value.auto_refresh,
        (enabled) => {
            if (autoRefresh.value !== enabled) {
                autoRefresh.value = enabled;
            }
        },
    );

    watch(globalSearch, (query) => {
        const value = query.trim();

        SEARCHABLE_CONTROL_KEYS.forEach((key) => {
            controls[key].state.search = value;
        });
    });

    const dashboardContext = {
        loading,
        error,
        autoRefresh,
        sections,
        revenueRange,
        hoveredBar,
        selectedStat,
        propertyFilter,
        invoiceFilter,
        activityFilter,
        quickActionQuery,
        globalSearch,
        settings,
        settingsSaved,
        stats,
        propertyStats,
        invoiceStats,
        revenueOverview,
        revenueSummary,
        revenueCollections,
        receivableAging,
        upcomingContracts,
        recentActivity,
        systemAlerts,
        quickActions,
        properties,
        customers,
        agents,
        tenants,
        inquiries,
        contracts,
        invoices,
        payments,
        bookings,
        maintenance,
        notifications,
        reports,
        reportStats,
        roles,
        permissionModules,
        selectedRole,
        controls,
        filteredQuickActions,
        visibleRevenueOverview,
        filteredPropertyStats,
        filteredInvoiceStats,
        filteredActivity,
        revenueSummaryCards,
        unreadNotificationCount,
        statusFilterOptions: STATUS_FILTER_OPTIONS,
        sortOptions: SORT_OPTIONS,
        formatCurrency,
        formatNumber,
        formatDate,
        barHeight,
        propertyBarWidth,
        invoiceBarWidth,
        setRevenueRange,
        selectStat,
        clearSelectedStat,
        togglePropertyFilter,
        clearPropertyFilter,
        toggleInvoiceFilter,
        clearInvoiceFilter,
        setActivityFilter,
        hoverBar,
        clearHoveredBar,
        openDetail,
        viewProperty,
        handleFavorite,
        handleCompare,
        selectRole,
        saveSettings,
        generateReport,
        markNotificationRead,
        toggleAutoRefresh,
        refresh,
        ...propertyInteractions,
    };

    provide('dashboard', reactive(dashboardContext));

    onMounted(() => {
        loadDashboard();
    });

    onBeforeUnmount(() => {
        stopAutoRefresh();
    });

    return {
        loading,
        error,
        lastUpdatedLabel,
        autoRefresh,
        globalSearch,
        modalOpen,
        modalTitle,
        modalItem,
        unreadNotificationCount,
        refresh,
        toggleAutoRefresh,
        closeModal,
        compareItems: propertyInteractions.compareItems,
        compareModalOpen: propertyInteractions.compareModalOpen,
        canAddToCompare: propertyInteractions.canAddToCompare,
        formatCurrency,
        removeFromCompare: propertyInteractions.removeFromCompare,
        clearCompare: propertyInteractions.clearCompare,
        openCompareModal: propertyInteractions.openCompareModal,
    };
}
