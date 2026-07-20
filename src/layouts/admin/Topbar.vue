<template>
    <header
        class="fixed top-0 right-0 z-[999] flex h-[var(--admin-topbar-height)] items-center gap-4 border-b border-[var(--admin-border)] bg-[var(--admin-topbar-bg)] px-6 backdrop-blur-xl transition-all duration-300 left-[var(--sidebar-width)] max-lg:left-0"
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

        <div class="relative hidden max-w-md flex-1 md:block">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
                type="search"
                placeholder="Search properties, users, contracts..."
                class="h-10 w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] pl-11 pr-4 text-[var(--admin-text)] outline-none transition-all duration-300 focus:border-rosewood-accent/35 focus:shadow-[0_0_0_4px_rgba(214,184,193,0.22)]"
            >
        </div>

        <ul class="ml-auto flex list-none items-center gap-2 p-0">
            <li>
                <ThemeToggle />
            </li>
            <li>
                <Notification />
            </li>
            <li>
                <UserProfile />
            </li>
        </ul>
    </header>
</template>

<script>
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import Notification from './Notification.vue';
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
        Notification,
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
