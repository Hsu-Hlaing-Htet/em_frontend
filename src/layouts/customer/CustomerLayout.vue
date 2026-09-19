<template>
    <div
        data-customer-layout
        :data-theme="themeMode"
        class="customer-shell admin-background min-h-screen text-[var(--admin-text)] transition-colors duration-300"
    >
        <header class="customer-portal-header language-switcher-surface">
            <div class="customer-portal-header-inner">
                <RosewoodBrand
                    :to="{ name: 'customerDashboard' }"
                    variant="on-light"
                    size="md"
                    class="customer-portal-brand"
                />

                <ul class="customer-portal-header-actions language-switcher-host">
                    <li>
                        <ThemeToggle plain />
                    </li>
                    <li class="language-switcher-host">
                        <LanguageSwitcher plain />
                    </li>
                    <li>
                        <CustomerNotificationBell :count="unreadCount" />
                    </li>
                    <li class="customer-portal-header-profile">
                        <CustomerUserProfile :avatar-url="profileAvatar" />
                    </li>
                </ul>
            </div>
        </header>

        <main class="customer-main">
            <AppBreadcrumb v-if="showBreadcrumbs" />
            <router-view />
        </main>

        <GlobalFooter variant="portal" />

        <nav class="customer-mobile-nav" :aria-label="$t('navigation.mobileNavigation')">
            <router-link
                v-for="item in mobileNavItems"
                :key="item.to"
                :to="item.to"
                class="customer-mobile-nav-item"
                :class="{ 'is-active': isActive(item.to) }"
            >
                <span class="customer-mobile-nav-icon">
                    <i :class="item.icon" aria-hidden="true" />
                    <span
                        v-if="item.badge"
                        class="customer-mobile-nav-badge"
                    >
                        {{ item.badge > 9 ? '9+' : item.badge }}
                    </span>
                </span>
                <span>{{ item.label }}</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppBreadcrumb from '@/layouts/admin/Breadcrumb.vue';
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import LanguageSwitcher from '@/components/global/LanguageSwitcher.vue';
import RosewoodBrand from '@/components/global/RosewoodBrand.vue';
import GlobalFooter from '@/components/global/GlobalFooter.vue';
import CustomerNotificationBell from '@/layouts/customer/CustomerNotificationBell.vue';
import CustomerUserProfile from '@/layouts/customer/CustomerUserProfile.vue';
import { useThemeStore } from '@/stores/themeStore';
import { useCustomerNotificationStore } from '@/modules/customer/notifications/store';
import { service } from '@/modules/customer/service';

const route = useRoute();
const { t } = useI18n();
const themeStore = useThemeStore();
const { mode: themeMode } = storeToRefs(themeStore);

const notificationStore = useCustomerNotificationStore();
const unreadCount = computed(() => notificationStore.unreadCount);
const profileAvatar = ref('');

const mobileNavItems = computed(() => [
    { label: t('common.home'), to: '/customer/dashboard', icon: 'pi pi-home' },
    { label: t('customer.account'), to: '/customer/profile', icon: 'pi pi-user' },
    {
        label: t('customer.notifications'),
        to: '/customer/notifications',
        icon: 'pi pi-bell',
        badge: unreadCount.value > 0 ? unreadCount.value : null,
    },
]);

const isActive = (path) => {
    if (path === '/customer/profile') {
        return route.path === '/customer/profile' || route.path === '/customer/account';
    }

    return route.path === path || route.path.startsWith(`${path}/`);
};

const showBreadcrumbs = computed(() => Boolean(route.meta?.breadcrumbs?.length) && route.name !== 'customerDashboard');

async function loadHeaderMeta() {
    try {
        const [profileResponse] = await Promise.allSettled([
            service.getProfile(),
            notificationStore.fetchAll(),
        ]);

        if (profileResponse.status === 'fulfilled') {
            profileAvatar.value = profileResponse.value?.data?.avatar_path || '';
        }
    } catch {
    }
}

onMounted(loadHeaderMeta);
</script>
