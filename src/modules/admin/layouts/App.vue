<template>
    <div
        data-admin-layout
        :data-admin-theme="themeMode"
        :data-sidebar-collapsed="staticMenuInactive ? 'true' : 'false'"
        :data-mobile-sidebar-open="mobileMenuActive ? 'true' : 'false'"
        class="admin-background flex min-h-screen text-[var(--admin-text)] transition-colors duration-300"
        @click="onWrapperClick"
    >
        <aside
            class="admin-sidebar fixed inset-y-0 left-0 z-[1000] flex w-[var(--sidebar-width)] flex-col border-r border-white/10 shadow-2xl transition-all duration-300"
            @click.stop="onSidebarClick"
        >
            <MenuHeader
                :menu-active="staticMenuInactive"
                :mobile-menu-active="mobileMenuActive"
                @menu-toggle="onMenuToggle"
            />
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </aside>

        <div class="ml-[var(--sidebar-width)] flex min-h-screen flex-1 flex-col transition-all duration-300 max-lg:ml-0">
            <TopBar @menu-toggle="onMenuToggle" />
            <main class="flex-1 p-6 pt-[calc(var(--admin-topbar-height)+1.5rem)] max-sm:p-4 max-sm:pt-[calc(var(--admin-topbar-height)+1rem)]">
                <AppBreadcrumb />
                <router-view />
            </main>
            <Footer />
        </div>

        <transition name="layout-mask">
            <div
                v-if="mobileMenuActive"
                class="fixed inset-0 z-[998] bg-[var(--admin-mask)] backdrop-blur-sm lg:hidden"
            />
        </transition>
    </div>
</template>

<script>
import { computed, getCurrentInstance, provide } from 'vue';
import { storeToRefs } from 'pinia';
import TopBar from './Topbar.vue';
import AppMenu from './Menu.vue';
import MenuHeader from './MenuHeader.vue';
import Footer from './Footer.vue';
import AppBreadcrumb from './Breadcrumb.vue';
import menuList from './menu';
import { useThemeStore } from '@/modules/admin/themeStore';

export default {
    components: {
        TopBar,
        AppMenu,
        MenuHeader,
        Footer,
        AppBreadcrumb,
    },
    setup() {
        const instance = getCurrentInstance();
        const themeStore = useThemeStore();
        const { mode: themeMode } = storeToRefs(themeStore);

        provide(
            'sidebarCollapsed',
            computed(() => {
                const vm = instance?.proxy;

                if (!vm) {
                    return false;
                }

                return vm.staticMenuInactive && vm.layoutMode === 'static';
            }),
        );

        return { themeMode };
    },
    data() {
        return {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menuClick: false,
            menu: menuList,
        };
    },
    mounted() {
        useThemeStore().applyTheme();
    },
    watch: {
        $route() {
            this.mobileMenuActive = false;
            this.overlayMenuActive = false;
        },
    },
    beforeUpdate() {
        document.body.classList.toggle('body-overflow-hidden', this.mobileMenuActive);
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle(event) {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
                    this.overlayMenuActive = !this.overlayMenuActive;
                    this.mobileMenuActive = false;
                } else {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            } else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
    },
};
</script>

<style scoped>
.layout-mask-enter-active,
.layout-mask-leave-active {
    transition: opacity 0.25s ease;
}

.layout-mask-enter-from,
.layout-mask-leave-to {
    opacity: 0;
}

:global(body.body-overflow-hidden) {
    overflow: hidden;
}
</style>
