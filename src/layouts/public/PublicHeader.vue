
<script setup>
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import { useStickyNavbar } from '@/composables/public/useStickyNavbar';

defineProps({
    currentRoute: {
        type: Object,
        required: true,
    },
    isAuthenticated: {
        type: Boolean,
        required: true,
    },
    mobileMenuOpen: {
        type: Boolean,
        required: true,
    },
    navLinks: {
        type: Array,
        required: true,
    },
});

defineEmits(['close-mobile-menu', 'open-mobile-menu']);

const { isScrolled } = useStickyNavbar();

function isPublicNavLinkActive(link, currentRoute) {
    if (typeof link.to === 'string') return currentRoute.path === link.to;
    const samePath = currentRoute.path === (link.to.path || '/');
    const sameHash = link.to.hash ? currentRoute.hash === link.to.hash : true;
    return samePath && sameHash;
}
</script>

<template>
    <div class="topbar">
        <div class="container topbar-inner">
            <div class="topbar-contact">
                <span><i class="pi pi-phone" /> +95 9 55000001</span>
                <span><i class="pi pi-envelope" /> hello@rosewoodroyale.com</span>
            </div>
            <div class="topbar-social">
                <a href="#" aria-label="Facebook"><i class="pi pi-facebook" /></a>
                <a href="#" aria-label="Instagram"><i class="pi pi-instagram" /></a>
                <a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin" /></a>
            </div>
        </div>
    </div>

    <header
        class="navbar-sticky"
        :class="{ 'is-scrolled': isScrolled }"
    >
        <div class="container navbar-inner">
            <router-link to="/" class="brand-mark" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit;">
                <img src="@/assets/images/logo-white.jpg" alt="Rosewood Royale Logo" class="logo" style="height: 40px; width: auto;">
                <span style="color: var(--dark-pink); font-weight: 600; font-size: 1.25rem;">Rosewood Royale</span>
            </router-link>

            <nav class="main-nav">
                <router-link
                    v-for="link in navLinks"
                    :key="link.label"
                    :to="link.to"
                    class="nav-link"
                    :class="{ 'is-active': isPublicNavLinkActive(link, currentRoute) }"
                >
                    {{ link.label }}
                </router-link>
            </nav>

            <div class="auth-actions">
                <ThemeToggle />
                <slot name="actions" />
            </div>

            <button class="mobile-menu-trigger" @click="$emit('open-mobile-menu')">
                <i class="pi pi-bars" />
            </button>
        </div>
    </header>

    <Sidebar :visible="mobileMenuOpen" position="right" class="mobile-sidebar" @update:visible="$emit('close-mobile-menu')">
        <div class="mobile-links">
            <router-link
                v-for="link in navLinks"
                :key="`mobile-${link.label}`"
                :to="link.to"
                class="mobile-link"
                @click="$emit('close-mobile-menu')"
            >
                {{ link.label }}
            </router-link>

            <div class="mobile-extra-actions">
                <ThemeToggle />
                <slot name="mobile-actions" />
            </div>
        </div>
    </Sidebar>
</template>
