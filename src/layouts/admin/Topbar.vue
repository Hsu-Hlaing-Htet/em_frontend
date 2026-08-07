<template>
    <header
        class="fixed top-0 right-0 z-[999] flex h-[var(--admin-topbar-height)] items-center gap-4 overflow-visible border-b border-[var(--admin-border)] bg-[var(--admin-topbar-bg)] px-6 backdrop-blur-xl transition-all duration-300 left-[var(--sidebar-width)] max-lg:left-0"
    >
        <button
            type="button"
            class="min-[992px]:!hidden"
            :aria-label="mobileMenuActive ? 'Close navigation' : 'Open navigation'"
            :aria-expanded="mobileMenuActive"
            aria-controls="admin-navigation"
            @click="onMenuToggle"
        >
            <i class="pi pi-bars" />
        </button>

        <div class="text-base font-bold text-rosewood lg:hidden">Rosewood Royale</div>

        <ul class="ml-auto flex list-none items-center gap-2.5 p-0">
            <li>
                <ThemeToggle />
            </li>
            <li>
                <LanguageSwitcher />
            </li>
            <li class="ml-2">
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
