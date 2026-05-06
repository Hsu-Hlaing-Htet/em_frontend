<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';

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
function isActive(link) { if (typeof link.to === 'string') return route.path === link.to; const samePath = route.path === (link.to.path || '/'); const sameHash = link.to.hash ? route.hash === link.to.hash : true; return samePath && sameHash; }
function closeMobileMenu() { mobileMenuOpen.value = false; }
function subscribeNewsletter() {
    if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) { toast.add({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address.', life: 2500 }); return; }
    toast.add({ severity: 'success', summary: 'Subscribed', detail: 'Thank you for subscribing to Rosewood Royale updates.', life: 2800 });
    newsletterEmail.value = '';
}
</script>
<template>
    <div class="rr-shell"><div class="rr-topbar"><div class="rr-container rr-topbar-inner"><div class="rr-topbar-contact"><span><i class="pi pi-phone" /> +95 9 55000001</span><span><i class="pi pi-envelope" /> hello@rosewoodroyale.com</span></div><div class="rr-topbar-social"><a href="#" aria-label="Facebook"><i class="pi pi-facebook" /></a><a href="#" aria-label="Instagram"><i class="pi pi-instagram" /></a><a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin" /></a></div></div></div>
        <header class="rr-navbar-sticky"><div class="rr-container rr-navbar-inner"><router-link to="/" class="rr-brand-mark">Rosewood Royale</router-link><nav class="rr-main-nav"><router-link v-for="link in navLinks" :key="link.label" :to="link.to" class="rr-nav-link" :class="{ 'is-active': isActive(link) }">{{ link.label }}</router-link></nav><div class="rr-auth-actions"><template v-if="isAuthenticated"><router-link :to="dashboardRoute()"><PvButton label="Dashboard" class="rr-btn rr-btn-secondary" /></router-link><PvButton label="Logout" class="rr-btn rr-btn-primary" @click="logout" /></template><template v-else><router-link to="/login"><PvButton label="Login" class="rr-btn rr-btn-secondary" /></router-link></template></div><button class="rr-mobile-menu-trigger" @click="mobileMenuOpen = true"><i class="pi pi-bars" /></button></div></header>
        <PvSidebar v-model:visible="mobileMenuOpen" position="right" class="rr-mobile-sidebar"><div class="rr-mobile-links"><router-link v-for="link in navLinks" :key="`mobile-${link.label}`" :to="link.to" class="rr-mobile-link" @click="closeMobileMenu">{{ link.label }}</router-link></div></PvSidebar>
        <main><router-view /></main>
        <footer class="rr-footer"><div class="rr-container rr-footer-bottom"><small>© {{ currentYear }} Rosewood Royale. All rights reserved.</small></div></footer>
    </div>
</template>
