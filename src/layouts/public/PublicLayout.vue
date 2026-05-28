<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/modules/auth/store';
import PublicHeader from './publiclayouts/PublicHeader.vue';
import PublicFooter from './publiclayouts/PublicFooter.vue';
import PublicLoginModal from '@/components/PublicLoginModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated.value);
const currentYear = new Date().getFullYear();
const mobileMenuOpen = ref(false);
const loginModalOpen = ref(false);
const newsletterEmail = ref('');
const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Rent', to: '/rent' },
    { label: 'Buy', to: '/buy' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
];

let revealObserver = null;

async function logout() { await auth.logout(); router.push('/'); }
function dashboardRoute() { return auth.role.value === 'admin' ? '/admin/dashboard' : '/user/dashboard'; }
function closeMobileMenu() { mobileMenuOpen.value = false; }
function openLoginModal() { loginModalOpen.value = true; }
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

        const elements = Array.from(document.querySelectorAll('.reveal, .fade-on-scroll'));

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

onMounted(observeRevealElements);

onBeforeUnmount(() => {
    if (revealObserver) {
        revealObserver.disconnect();
    }
});
</script>
<template>
    <div class="shell">
        <PublicHeader
            :current-route="route"
            :is-authenticated="isAuthenticated"
            :mobile-menu-open="mobileMenuOpen"
            :nav-links="navLinks"
            @open-mobile-menu="mobileMenuOpen = true"
            @close-mobile-menu="closeMobileMenu"
        >
            <template #actions>
                <template v-if="isAuthenticated">
                    <router-link :to="dashboardRoute()">
                        <Button label="Dashboard" />
                    </router-link>
                    <Button label="Logout" @click="logout" />
                </template>
                <template v-else>
                    <button
                        type="button"
                        class="cursor-pointer group relative bg-white text-[var(--dark-pink)] border-2 border-[#552032] text-md px-4 py-2 rounded-md 
                                transition-all duration-300
                                hover:shadow-[#552032]/40
                                active:scale-95 scale-100
                                    hover:scale-105
                                    hover:invert-0
                                    transition-all duration-500 ease-out"
                        @click="openLoginModal"
                    >
                        Login
                    </button>
                </template>
            </template>

            <template #mobile-actions>
                <div class="mobile-auth-wrapper" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; padding: 0 1rem;">
                    <template v-if="isAuthenticated">
                        <router-link :to="dashboardRoute()" @click="closeMobileMenu">
                            <Button label="Dashboard" style="width: 100%" />
                        </router-link>
                        <Button label="Logout"  @click="() => { logout(); closeMobileMenu(); }" style="width: 100%" />
                    </template>
                    <template v-else>
                        <Button
                            label="Login"
                            style="width: 100%"
                            @click="() => { openLoginModal(); closeMobileMenu(); }"
                        />
                    </template>
                </div>
            </template>
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
                    @after-enter="observeRevealElements"
                >
                    <div :key="route.fullPath">
                        <component :is="Component" />
                    </div>
                </Transition>
            </router-view>
        </main>

        <PublicLoginModal v-model="loginModalOpen" />

        <PublicFooter :current-year="currentYear" />
    </div>
</template>
