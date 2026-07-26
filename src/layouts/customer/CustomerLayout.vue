<template>
    <div
        data-customer-layout
        :data-theme="themeMode"
        class="customer-shell admin-background min-h-screen text-[var(--admin-text)] transition-colors duration-300"
    >
        <header class="border-b border-[var(--admin-border)] bg-[var(--admin-surface-solid)]">
            <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
                <router-link
                    to="/customer/dashboard"
                    class="text-lg font-semibold text-[var(--admin-text)]"
                >
                    Rosewood Royale
                </router-link>

                <div v-if="user" class="hidden text-sm text-[var(--admin-text-muted)] sm:block">
                    {{ user.name }}
                </div>

                <nav class="customer-desktop-nav ml-auto" aria-label="Customer navigation">
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

                <div class="ml-auto flex items-center gap-1 lg:ml-0">
                    <ThemeToggle />
                    <Button
                        label="Logout"
                        severity="secondary"
                        text
                        size="small"
                        class="hidden sm:inline-flex"
                        @click="handleLogout"
                    />
                    <Button
                        icon="pi pi-sign-out"
                        severity="secondary"
                        text
                        rounded
                        class="sm:hidden"
                        aria-label="Logout"
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

        <nav class="customer-mobile-nav" aria-label="Mobile navigation">
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
import Button from 'primevue/button';
import AppBreadcrumb from '@/layouts/admin/Breadcrumb.vue';
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import DevelopedByCredit from '@/components/global/DevelopedByCredit.vue';
import { useAuthStore } from '@/modules/auth/store';
import { useThemeStore } from '@/stores/themeStore';

export default defineComponent({
    name: 'CustomerLayout',
    components: {
        Button,
        AppBreadcrumb,
        ThemeToggle,
        DevelopedByCredit,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const authStore = useAuthStore();
        const themeStore = useThemeStore();
        const { user } = storeToRefs(authStore);
        const { mode: themeMode } = storeToRefs(themeStore);

        const mobileNavItems = [
            { label: 'Home', to: '/customer/dashboard', icon: 'pi pi-home' },
            { label: 'Payments', to: '/customer/payments', icon: 'pi pi-wallet' },
            { label: 'Invoices', to: '/customer/invoices', icon: 'pi pi-file' },
            { label: 'Alerts', to: '/customer/notifications', icon: 'pi pi-bell' },
            { label: 'Profile', to: '/customer/profile', icon: 'pi pi-user' },
        ];

        const navItems = [
            { label: 'Dashboard', to: '/customer/dashboard' },
            { label: 'Profile', to: '/customer/profile' },
            { label: 'Contracts', to: '/customer/contracts' },
            { label: 'Invoices', to: '/customer/invoices' },
            { label: 'Payments', to: '/customer/payments' },
            { label: 'Receipts', to: '/customer/receipts' },
            { label: 'Notifications', to: '/customer/notifications' },
        ];

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
