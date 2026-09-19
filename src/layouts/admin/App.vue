<template>
    <a href="#main-content" class="skip-link">{{ $t('common.skipToMainContent') }}</a>

    <div
        data-admin-layout
        :data-theme="themeMode"
        :data-sidebar-collapsed="staticMenuInactive ? 'true' : 'false'"
        :data-mobile-sidebar-open="mobileMenuActive ? 'true' : 'false'"
        class="admin-background flex min-h-screen text-[var(--admin-text)] transition-colors duration-300"
        @click="onWrapperClick"
    >
        <nav
            id="admin-navigation"
            :aria-label="$t('navigation.adminNavigation')"
            class="admin-sidebar fixed inset-y-0 left-0 z-[1000] flex w-[var(--sidebar-width)] flex-col border-r border-[var(--admin-border)] transition-all duration-300"
            @click.stop="onSidebarClick"
        >
            <MenuHeader
                :menu-active="staticMenuInactive"
                :mobile-menu-active="mobileMenuActive"
                :aria-expanded="mobileMenuActive"
                @menu-toggle="onMenuToggle"
            />
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </nav>

        <div class="ml-[var(--sidebar-width)] flex min-h-screen flex-1 flex-col transition-all duration-300 max-lg:ml-0">
            <TopBar
                :mobile-menu-active="mobileMenuActive"
                @menu-toggle="onMenuToggle"
            />
            <main
                id="main-content"
                tabindex="-1"
                class="flex-1 p-6 pt-[calc(var(--admin-topbar-height)+1.5rem)] max-sm:p-4 max-sm:pt-[calc(var(--admin-topbar-height)+1rem)]"
            >
                <AppBreadcrumb />
                <router-view v-slot="{ Component, route }">
                    <Transition
                        name="page-fade"
                        mode="out-in"
                    >
                        <div
                            :key="route.path"
                            class="page-transition-root"
                        >
                            <component :is="Component" />
                        </div>
                    </Transition>
                </router-view>
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
import { useThemeStore } from '@/stores/themeStore';
import { preventEnterFormSubmit } from '@/helpers/forms/preventEnterSubmit';

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
        document.addEventListener('keydown', this.onEnterKeydown, true);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.onEnterKeydown, true);
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
        onEnterKeydown(event) {
            preventEnterFormSubmit(event);
        },
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
.skip-link {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 1100;
    transform: translateY(-200%);
    border-radius: 9999px;
    background: var(--admin-primary);
    color: var(--rw-on-primary);
    padding: 0.65rem 1rem;
    text-decoration: none;
    font-weight: 600;
}

.skip-link:focus {
    transform: translateY(0);
    outline: 3px solid var(--rw-focus-ring);
    outline-offset: 2px;
}

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

:global(.page-fade-enter-active),
:global(.page-fade-leave-active) {
    transition: opacity 200ms ease-out, transform 200ms ease-out;
}

:global(.page-fade-enter-from) {
    opacity: 0;
    transform: translateY(6px);
}

:global(.page-fade-leave-to) {
    opacity: 0;
    transform: translateY(-4px);
}

:global(.page-transition-root) {
    display: block;
    width: 100%;
}

@media (prefers-reduced-motion: reduce) {
    :global(.page-fade-enter-active),
    :global(.page-fade-leave-active) {
        transition: none;
    }

    :global(.page-fade-enter-from),
    :global(.page-fade-leave-to) {
        opacity: 1;
        transform: none;
    }
}
</style>
