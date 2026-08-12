<template>
    <div
        data-customer-layout
        :data-theme="themeMode"
        class="customer-shell admin-background min-h-screen text-[var(--admin-text)] transition-colors duration-300"
    >
        <header class="language-switcher-surface border-b border-[var(--admin-border)] bg-[var(--admin-surface-solid)]">
            <div class="language-switcher-host mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
                <router-link
                    to="/customer/dashboard"
                    class="text-lg font-semibold text-[var(--admin-text)]"
                >
                    Rosewood Royale
                </router-link>

                <div v-if="user" class="hidden text-sm text-[var(--admin-text-muted)] sm:block">
                    {{ user.name }}
                </div>

                <nav class="customer-desktop-nav ml-auto" :aria-label="$t('customer.dashboard')">
                    <router-link
                        v-for="item in navItems"
                        :key="item.to"
                        :to="item.to"
                        class="rounded px-3 py-2 text-sm transition-colors"
                        :class="isActive(item.to)
                            ? 'bg-[var(--admin-primary)] text-[var(--rw-on-primary)]'
                            : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-border)]'"
                    >
                        {{ item.label }}
                    </router-link>
                </nav>

                <div class="language-switcher-host ml-auto flex items-center gap-2.5 lg:ml-0">
                    <ThemeToggle />
                    <LanguageSwitcher />
                    <Button
                        :label="$t('common.logout')"
                        severity="secondary"
                        text
                        size="small"
                        class="hidden sm:inline-flex ml-2"
                        @click="handleLogout"
                    />
                    <Button
                        icon="pi pi-sign-out"
                        severity="secondary"
                        text
                        rounded
                        class="sm:hidden"
                        :aria-label="$t('common.logout')"
                        @click="handleLogout"
                    />
                </div>
            </div>
        </header>

        <main class="customer-main mx-auto max-w-7xl px-4 py-6">
            <AppBreadcrumb v-if="showBreadcrumbs" />
            <router-view />
        </main>

        <footer class="flex items-center justify-center px-4 py-4">
            <DevelopedByCredit />
        </footer>

        <nav class="customer-mobile-nav" :aria-label="$t('navigation.mobileNavigation')">
            <router-link
                v-for="item in mobileNavItems"
                :key="item.to"
                :to="item.to"
                class="customer-mobile-nav-item"
                :class="{ 'is-active': isActive(item.to) }"
            >
                <i :class="item.icon" />
                <span>{{ item.label }}</span>
            </router-link>
        </nav>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import AppBreadcrumb from '@/layouts/admin/Breadcrumb.vue';
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import LanguageSwitcher from '@/components/global/LanguageSwitcher.vue';
import DevelopedByCredit from '@/components/global/DevelopedByCredit.vue';
import { useAuthStore } from '@/modules/auth/store';
import { useThemeStore } from '@/stores/themeStore';

export default defineComponent({
    name: 'CustomerLayout',
    components: {
        Button,
        AppBreadcrumb,
        ThemeToggle,
        LanguageSwitcher,
        DevelopedByCredit,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n();
        const authStore = useAuthStore();
        const themeStore = useThemeStore();
        const { user } = storeToRefs(authStore);
        const { mode: themeMode } = storeToRefs(themeStore);

        const mobileNavItems = computed(() => [
            { label: t('common.home'), to: '/customer/dashboard', icon: 'pi pi-home' },
            { label: t('customer.payments'), to: '/customer/payments', icon: 'pi pi-wallet' },
            { label: t('customer.invoices'), to: '/customer/invoices', icon: 'pi pi-file' },
            { label: t('common.alerts'), to: '/customer/notifications', icon: 'pi pi-bell' },
            { label: t('customer.profile'), to: '/customer/profile', icon: 'pi pi-user' },
        ]);

        const navItems = computed(() => [
            { label: t('customer.dashboard'), to: '/customer/dashboard' },
            { label: t('customer.profile'), to: '/customer/profile' },
            { label: t('customer.contracts'), to: '/customer/contracts' },
            { label: t('customer.invoices'), to: '/customer/invoices' },
            { label: t('customer.payments'), to: '/customer/payments' },
            { label: t('customer.receipts'), to: '/customer/receipts' },
            { label: t('customer.maintenance'), to: '/customer/maintenance-requests' },
            { label: t('customer.notifications'), to: '/customer/notifications' },
        ]);

        const isActive = (path) => route.path.startsWith(path);
        const showBreadcrumbs = computed(() => Boolean(route.meta?.breadcrumbs?.length));

        const handleLogout = async () => {
            await authStore.logout();
            await router.push({ name: 'login' });
        };

        return {
            user,
            navItems,
            mobileNavItems,
            isActive,
            showBreadcrumbs,
            themeMode,
            handleLogout,
        };
    },
});
</script>
