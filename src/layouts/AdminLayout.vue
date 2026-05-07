<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const items = [
    { label: 'Dashboard', icon: 'pi pi-home', to: '/admin/dashboard' },
    { label: 'Properties', icon: 'pi pi-building', to: '/admin/properties' },
    { label: 'Owners', icon: 'pi pi-users', to: '/admin/owners' },
    { label: 'Tenants', icon: 'pi pi-id-card', to: '/admin/tenants' },
    { label: 'Contracts', icon: 'pi pi-file', to: '/admin/contracts' },
    { label: 'Invoices', icon: 'pi pi-receipt', to: '/admin/invoices' },
    { label: 'Payments', icon: 'pi pi-wallet', to: '/admin/payments' },
    { label: 'Meter Readings', icon: 'pi pi-bolt', to: '/admin/meter-readings' },
    { label: 'Reports', icon: 'pi pi-chart-line', to: '/admin/reports' },
];

const pageTitle = computed(() => {
    const active = items.find((item) => route.path.startsWith(item.to));
    return active ? active.label : 'Admin';
});

async function logout() {
    await auth.logout();
    router.push('/login');
}
</script>

<template>
    <div class="rr-shell" style="display: grid; grid-template-columns: 260px 1fr; min-height: 100vh">
        <aside style="border-right: 1px solid var(--rr-border); background: #f8f8f8; padding: 1.2rem">
            <h1 class="rr-title" style="font-size: 0.82rem; margin-top: 0">Rosewood Royale</h1>
            <p class="rr-muted" style="font-size: 0.8rem; margin-top: 0.2rem">Admin Console</p>
            <div style="margin-top: 1.1rem; display: grid; gap: 0.35rem">
                <router-link v-for="item in items" :key="item.to" :to="item.to" :style="{ padding: '0.55rem 0.65rem', border: '1px solid var(--rr-border)', background: route.path.startsWith(item.to) ? '#111111' : '#ffffff', color: route.path.startsWith(item.to) ? '#ffffff' : '#111111', fontSize: '0.88rem' }">
                    <i :class="item.icon" style="margin-right: 0.45rem" />
                    {{ item.label }}
                </router-link>
            </div>
            <PvButton label="Logout" outlined severity="secondary" style="width: 100%; margin-top: 1rem" @click="logout" />
        </aside>
        <section>
            <header style="padding: 1rem 1.2rem; border-bottom: 1px solid var(--rr-border); display: flex; justify-content: space-between">
                <h2 class="rr-title" style="font-size: 0.78rem; margin: 0">{{ pageTitle }}</h2>
                <span class="rr-muted" style="font-size: 0.86rem">{{ auth.state.user?.name }}</span>
            </header>
            <div style="padding: 1.2rem">
                <router-view />
            </div>
        </section>
    </div>
</template>
