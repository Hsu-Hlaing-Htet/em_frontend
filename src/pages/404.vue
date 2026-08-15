<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StatusPage from '@/components/global/StatusPage.vue';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isAdminContext = computed(() => route.path.startsWith('/admin'));
const isCustomerContext = computed(() => route.path.startsWith('/customer'));
const isAuthenticated = computed(() => auth.isAuthenticated);

const primaryCta = computed(() => {
    if (isAdminContext.value && isAuthenticated.value) {
        return {
            label: 'Go to dashboard',
            to: { name: 'dashboard' },
        };
    }

    if (isCustomerContext.value && isAuthenticated.value) {
        return {
            label: 'Go to dashboard',
            to: { name: 'customerDashboard' },
        };
    }

    if (isAuthenticated.value) {
        if (auth.role === 'admin' || auth.role === 'super_admin') {
            return {
                label: 'Go to dashboard',
                to: { name: 'dashboard' },
            };
        }

        if (auth.role === 'customer') {
            return {
                label: 'Go to dashboard',
                to: { name: 'customerDashboard' },
            };
        }
    }

    if (!isAuthenticated.value) {
        return {
            label: 'Go to login',
            to: { name: 'login' },
        };
    }

    return {
        label: 'Go to home',
        to: { name: 'home' },
    };
});

const goBack = () => {
    if (window.history.length > 1) {
        router.back();
        return;
    }

    router.push(primaryCta.value.to);
};
</script>

<template>
    <StatusPage
        code="404"
        icon="pi pi-compass"
        title="Page not found"
        message="The page you are looking for may have been moved, removed, or never existed."
        :primary-cta="primaryCta"
        @back="goBack"
    />
</template>
