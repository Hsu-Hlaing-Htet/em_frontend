<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import PublicHeader from './PublicHeader.vue';
import PublicFooter from './PublicFooter.vue';
import FloatingChat from '@/components/global/FloatingChat.vue';

const route = useRoute();
const currentYear = new Date().getFullYear();
const mobileMenuOpen = ref(false);

const navLinks = [
    { label: 'Home', to: '/' },
    {
        label: 'Properties',
        children: [
            { label: 'All Properties', to: '/properties' },
            { label: 'For Rent', to: '/rent' },
            { label: 'For Sale', to: '/buy' },
        ],
    },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

const conciergeListingPurpose = computed(() => {
    if (route.name === 'rent' || route.query.purpose === 'rent') {
        return 'rent';
    }

    if (route.name === 'buy' || route.query.purpose === 'sale') {
        return 'sale';
    }

    return 'sale';
});

const showPublicConcierge = computed(() => !route.path.startsWith('/customer'));

let revealObserver = null;

function closeMobileMenu() {
    mobileMenuOpen.value = false;
}

function observeRevealElements() {
    nextTick(() => {
        if (revealObserver) {
            revealObserver.disconnect();
            revealObserver = null;
        }

        const elements = Array.from(
            document.querySelectorAll('.reveal, .fade-on-scroll, .reveal-stagger')
        );

        if (!elements.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        elements.forEach((element) => {
            if (!element.classList.contains('is-visible')) {
                revealObserver.observe(element);
            }
        });
    });
}

function handleRouteAfterEnter() {
    observeRevealElements();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

watch(
    () => route.fullPath,
    () => {
        closeMobileMenu();
        observeRevealElements();
    }
);

onMounted(() => {
    observeRevealElements();
});

onBeforeUnmount(() => {
    if (revealObserver) {
        revealObserver.disconnect();
    }
});
</script>

<template>
    <div class="shell" data-public-layout>
        <PublicHeader
            :current-route="route"
            :mobile-menu-open="mobileMenuOpen"
            :nav-links="navLinks"
            @open-mobile-menu="mobileMenuOpen = true"
            @close-mobile-menu="closeMobileMenu"
        />

        <main>
            <router-view v-slot="{ Component }">
                <Transition
                    mode="out-in"
                    enter-active-class="page-enter"
                    @after-enter="handleRouteAfterEnter"
                >
                    <div :key="route.fullPath">
                        <component :is="Component" />
                    </div>
                </Transition>
            </router-view>
        </main>

        <PublicFooter :current-year="currentYear" />

        <FloatingChat
            v-if="showPublicConcierge"
            mode="property"
            :listing-purpose="conciergeListingPurpose"
            context-label="Online Property Assistant"
            question="Ask the Rosewood AI Concierge about residences."
        />
    </div>
</template>
