<template>
    <header
        class="admin-topbar language-switcher-surface fixed top-0 right-0 z-[999] flex h-[var(--admin-topbar-height)] min-w-0 items-center gap-3 overflow-visible border-b border-[var(--admin-border)] bg-[var(--admin-topbar-bg)] px-4 backdrop-blur-xl transition-all duration-300 sm:gap-4 sm:px-6 left-[var(--sidebar-width)] max-lg:left-0"
    >
        <button
            type="button"
            class="shrink-0 min-[992px]:!hidden"
            :aria-label="$t(mobileMenuActive ? 'navigation.closeNavigation' : 'navigation.openNavigation')"
            :aria-expanded="mobileMenuActive"
            aria-controls="admin-navigation"
            @click="onMenuToggle"
        >
            <i class="pi pi-bars" />
        </button>

        <ul class="language-switcher-host ml-auto flex min-w-0 list-none items-center gap-2 p-0 sm:gap-2.5">
            <li class="shrink-0">
                <ThemeToggle plain />
            </li>
            <li class="language-switcher-host shrink-0">
                <LanguageSwitcher plain />
            </li>
            <li class="ml-1 min-w-0 shrink overflow-visible sm:ml-2">
                <UserProfile />
            </li>
        </ul>
    </header>
</template>

<script>
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import LanguageSwitcher from '@/components/global/LanguageSwitcher.vue';
import UserProfile from './UserProfile.vue';

export default {
    name: 'AppTopbar',
    props: {
        mobileMenuActive: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ThemeToggle,
        LanguageSwitcher,
        UserProfile,
    },
    emits: ['menu-toggle'],
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
    },
};
</script>
