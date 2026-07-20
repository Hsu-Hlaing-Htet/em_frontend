<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import PublicHeader from './PublicHeader.vue';
import PublicFooter from './PublicFooter.vue';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const { mode: themeMode } = storeToRefs(themeStore);
const isAuthenticated = computed(() => Boolean(authStore.isAuthenticated));
const currentYear = new Date().getFullYear();
const mobileMenuOpen = ref(false);
const newsletterEmail = ref('');
const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Rent', to: '/rent' },
    { label: 'Buy', to: '/buy' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
];

let revealObserver = null;

function closeMobileMenu() { mobileMenuOpen.value = false; }
function subscribeNewsletter() {
    if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) { toast.add({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address.', life: 2500 }); return; }
    toast.add({ severity: 'success', summary: 'Subscribed', detail: 'Thank you for subscribing to Rosewood Royale updates.', life: 2800 });
    newsletterEmail.value = '';
}
function observeRevealElements() {
    nextTick(() => {
        if (revealObserver) {
            revealObserver.disconnect();
            revealObserver = null;
        }

        const elements = Array.from(document.querySelectorAll('.reveal, .fade-on-scroll, .reveal-stagger'));

        if (!elements.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
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
            { threshold: 0.16 }
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
}

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
    <div class="shell" data-public-layout :data-theme="themeMode">
        <PublicHeader
            :current-route="route"
            :is-authenticated="isAuthenticated"
            :mobile-menu-open="mobileMenuOpen"
            :nav-links="navLinks"
            @open-mobile-menu="mobileMenuOpen = true"
            @close-mobile-menu="closeMobileMenu"
        >
        </PublicHeader>
        <main>
            <router-view v-slot="{ Component }">
                <Transition
                    mode="out-in"
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-3"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                    @after-enter="handleRouteAfterEnter"
                >
                    <div :key="route.fullPath">
                        <component :is="Component" />
                    </div>
                </Transition>
            </router-view>
        </main>

        <PublicFooter :current-year="currentYear" />
    </div>
</template>
