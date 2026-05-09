<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/modules/auth/store';
import PublicHeader from './publiclayouts/PublicHeader.vue';
import PublicFooter from './publiclayouts/PublicFooter.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated.value);
const currentYear = new Date().getFullYear();
const mobileMenuOpen = ref(false);
const newsletterEmail = ref('');
const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Rent', to: '/rent' },
    { label: 'Buy', to: '/buy' },
    { label: 'Commercial', to: { path: '/', hash: '#commercial-space' } },
    { label: 'Services', to: { path: '/', hash: '#services' } },
    { label: 'Contact', to: '/contact' },
];

async function logout() { await auth.logout(); router.push('/'); }
function dashboardRoute() { return auth.role.value === 'admin' ? '/admin/dashboard' : '/user/dashboard'; }
function closeMobileMenu() { mobileMenuOpen.value = false; }
function subscribeNewsletter() {
    if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) { toast.add({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address.', life: 2500 }); return; }
    toast.add({ severity: 'success', summary: 'Subscribed', detail: 'Thank you for subscribing to Rosewood Royale updates.', life: 2800 });
    newsletterEmail.value = '';
}
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
                    <router-link to="/login">
                        <Button label="Login" />
                    </router-link>
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
                        <router-link to="/login" @click="closeMobileMenu">
                            <Button label="Login" style="width: 100%" />
                        </router-link>
                    </template>
                </div>
            </template>
        </PublicHeader>
        <main><router-view /></main>

        <PublicFooter :current-year="currentYear" />
    </div>
</template>
