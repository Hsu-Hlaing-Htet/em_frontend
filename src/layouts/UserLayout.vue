<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const tabs = [
    { label: 'Dashboard', to: '/user/dashboard' },
    { label: 'My Property', to: '/user/my-property' },
    { label: 'My Invoices', to: '/user/my-invoices' },
    { label: 'Payment History', to: '/user/payment-history' },
];
const title = computed(() => tabs.find((tab) => route.path.startsWith(tab.to))?.label || 'Owner Dashboard');
async function logout() { await auth.logout(); router.push('/login'); }
</script>
<template>
    <div class="rr-shell">
        <header class="rr-sticky-header"><div class="rr-container" style="display: flex; align-items: center; gap: 1rem; padding: 0.8rem 0"><router-link to="/" class="rr-title" style="font-size: 0.9rem">Rosewood Royale</router-link><div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-left: auto"><router-link v-for="tab in tabs" :key="tab.to" :to="tab.to" :style="{ border: '1px solid var(--rr-border)', padding: '0.4rem 0.7rem', background: route.path.startsWith(tab.to) ? '#111111' : '#ffffff', color: route.path.startsWith(tab.to) ? '#ffffff' : '#111111', fontSize: '0.85rem' }">{{ tab.label }}</router-link><PvButton label="Logout" outlined severity="secondary" size="small" @click="logout" /></div></div></header>
        <main class="rr-container" style="padding-top: 1.25rem"><h1 class="rr-title" style="font-size: 0.84rem">{{ title }}</h1><router-view /></main>
    </div>
</template>
